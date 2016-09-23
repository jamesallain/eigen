#import "ARAppDelegate+Emission.h"

#import "ARUserManager.h"
#import "Artist.h"
#import "ArtsyAPI+Following.h"
#import "ARDispatchManager.h"
#import "ARNetworkErrorManager.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARTopMenuViewController.h"
#import "ARAppConstants.h"
#import "AROptions.h"
#import "ARMenuAwareViewController.h"
#import "ARAppNotificationsDelegate.h"
#import "ARDefaults.h"

#import <Aerodramus/Aerodramus.h>
#import <Emission/AREmission.h>
#import <Emission/ARTemporaryAPIModule.h>
#import <Emission/ARSwitchBoardModule.h>
#import <Emission/AREventsModule.h>
#import <Emission/ARArtistComponentViewController.h>

#import <React/RCTUtils.h>
#import <objc/runtime.h>
#import <ARAnalytics/ARAnalytics.h>
#import <AppHub/AppHub.h>

static void
ArtistFollowRequestSuccess(RCTResponseSenderBlock block, BOOL following)
{
    block(@[ [NSNull null], @(following) ]);
}

static void
ArtistFollowRequestFailure(RCTResponseSenderBlock block, BOOL following, NSError *error)
{
    ar_dispatch_main_queue(^{
        [ARNetworkErrorManager presentActiveError:error withMessage:@"Failed to follow artist."];
    });
    block(@[ RCTJSErrorFromNSError(error), @(following) ]);
}

static void
ArtistGetFollowStatus(NSString *artistID, RCTResponseSenderBlock block)
{
    [ArtsyAPI checkFavoriteStatusForArtist:[[Artist alloc] initWithArtistID:artistID]
        success:^(BOOL following) {
            ArtistFollowRequestSuccess(block, following);
        }
        failure:^(NSError *error) {
            ArtistFollowRequestFailure(block, NO, error);
        }];
}

static void
ArtistSetFollowStatus(NSString *artistID, BOOL following, RCTResponseSenderBlock block)
{
    [ArtsyAPI setFavoriteStatus:following
        forArtist:[[Artist alloc] initWithArtistID:artistID]
        success:^(id response) {
            ArtistFollowRequestSuccess(block, following);
        }
        failure:^(NSError *error) {
            ArtistFollowRequestFailure(block, !following, error);
        }];
}


@implementation ARAppDelegate (Emission)

- (void)setupEmission;
{
    // AppHub's loading of our Emission instance is Async, so we let
    // the normal  JS run, then if we get the notification of a new build
    // we switch out the current emission instance.
    //
    if ([AROptions boolForOption:AROptionsStagingReactEnv]) {
        [AppHub setLogLevel: AHLogLevelDebug];
        [AppHub setApplicationID:@"Z6IwqK52JBXrKLI4kpvJ"];

        NSString *emissionHeadVersion = [[NSUserDefaults standardUserDefaults] valueForKey:AREmissionHeadVersionDefault];
        [[AppHub buildManager] setAutomaticPollingEnabled:NO];
        [[AppHub buildManager] setInstalledAppVersion: emissionHeadVersion];
        [[AppHub buildManager] setDebugBuildsEnabled:YES];

        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(newEmissionBuild) name:AHBuildManagerDidMakeBuildAvailableNotification object:nil];

        [[AppHub buildManager] fetchBuildWithCompletionHandler:^(AHBuild *result, NSError *error) {
            [self newEmissionBuild];
        }];
    }

    [self setupSharedEmission];
}

- (void)newEmissionBuild
{
    AHBuild *build = [[AppHub buildManager] currentBuild];
    NSURL *jsCodeLocation = [build.bundle URLForResource:@"main" withExtension:@"jsbundle"];
    AREmission *stagingEmission = [[AREmission alloc] initWithPackagerURL: jsCodeLocation];
    [AREmission setSharedInstance:stagingEmission];
}

- (void)setupSharedEmission
{
    AREmission *emission = [AREmission sharedInstance];
    emission.APIModule.artistFollowStatusProvider = ^(NSString *artistID, RCTResponseSenderBlock block) {
        // Leave the view state ‘unselected’ if there’s no signed-in user.
        if ([[ARUserManager sharedManager] currentUser] != nil) {
            ArtistGetFollowStatus(artistID, block);
        }
    };
    emission.APIModule.artistFollowStatusAssigner = ^(NSString *artistID, BOOL following, RCTResponseSenderBlock block) {
        // TODO: Can’t optimistically change the view state before the request, because a RCTResponseSenderBlock may
        //       only be invoked once.
        ArtistSetFollowStatus(artistID, following, block);
        if (following) {
            // Ask for push notification permission, if not already
            ARAppNotificationsDelegate *remoteNotificationsDelegate = [[JSDecoupledAppDelegate sharedAppDelegate] remoteNotificationsDelegate];
            [remoteNotificationsDelegate registerForDeviceNotificationsWithContext:ARAppNotificationsRequestContextArtistFollow];
        }
    };

    emission.switchBoardModule.presentNavigationViewController = ^(UIViewController *_Nonnull fromViewController,
                                                                   NSString *_Nonnull route) {
        UIViewController *viewController = [[ARSwitchBoard sharedInstance] loadPath:route];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
    };

    emission.switchBoardModule.presentModalViewController = ^(UIViewController *_Nonnull fromViewController,
                                                              NSString *_Nonnull route) {
        UIViewController *viewController = [[ARSwitchBoard sharedInstance] loadPath:route];
        [[ARTopMenuViewController sharedController] presentViewController:viewController
                                                                 animated:ARPerformWorkAsynchronously
                                                               completion:nil];
    };

    emission.eventsModule.eventOccurred = ^(UIViewController *_Nonnull fromViewController, NSDictionary *_Nonnull info) {
        NSMutableDictionary *properties = [info mutableCopy];
        [properties removeObjectForKey:@"name"];
        [ARAnalytics event:info[@"name"] withProperties:[properties copy]];
    };

}

@end

#pragma mark - ARMenuAwareViewController additions


@interface ARArtistComponentViewController (ARMenuAwareViewController) <ARMenuAwareViewController>
@end


@implementation ARArtistComponentViewController (ARMenuAwareViewController)

static UIScrollView *
FindFirstScrollView(UIView *view)
{
    for (UIView *subview in view.subviews) {
        if ([subview isKindOfClass:UIScrollView.class]) {
            return (UIScrollView *)subview;
        }
    }
    for (UIView *subview in view.subviews) {
        UIScrollView *result = FindFirstScrollView(subview);
        if (result) return result;
    }
    return nil;
}

- (void)viewDidLayoutSubviews;
{
    [super viewDidLayoutSubviews];
    self.menuAwareScrollView = FindFirstScrollView(self.view);
}

static char menuAwareScrollViewKey;

- (void)setMenuAwareScrollView:(UIScrollView *)scrollView;
{
    if (scrollView != self.menuAwareScrollView) {
        [self willChangeValueForKey:@"menuAwareScrollView"];
        objc_setAssociatedObject(self, &menuAwareScrollViewKey, scrollView, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
        [self didChangeValueForKey:@"menuAwareScrollView"];
    }
}

- (UIScrollView *)menuAwareScrollView;
{
    return objc_getAssociatedObject(self, &menuAwareScrollViewKey);
}

@end