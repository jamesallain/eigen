// import { Fair2_fair } from "__generated__/Fair2_fair.graphql"
// import { Fair2Query } from "__generated__/Fair2Query.graphql"
// import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
// import { SnappyHorizontalRail } from "lib/Components/StickyTabPage/SnappyHorizontalRail"
// import { defaultEnvironment } from "lib/relay/createEnvironment"
// import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
// import { Button, Flex, Separator, Theme } from "palette"
// import { eventNames } from "process"
// import React, { useEffect, useState } from "react"
// import { FlatList, ScrollView, Text, View } from "react-native"
// import { createFragmentContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
// import { Fair2EditorialFragmentContainer } from "./Components/Fair2Editorial"
// import { Fair2HeaderFragmentContainer } from "./Components/Fair2Header"

// interface Fair2QueryRendererProps {
//   fairID: string
// }

// interface Fair2Props {
//   fair: Fair2_fair
//   relay: RelayPaginationProp
// }

// const OurTabs = ({ fairArtworks, relay }) => {
//   // return (
//   //   <SnappyHorizontalRail width={300}>
//   //     <>
//   //       <Button>first</Button>
//   //       <Text>wer</Text>
//   //       <Text>wer</Text>
//   //       <Text>wer</Text>
//   //     </>
//   //     <>
//   //       <Button>second</Button>
//   //       <Text>wer</Text>
//   //     </>
//   //   </SnappyHorizontalRail>
//   // )
//   const [activeTab, setActiveTab] = useState(0)

//   console.log({ relay })

//   return (
//     <>
//       <Flex flexDirection="row">
//         <Button onPress={() => setActiveTab(0)}>first</Button>
//         <Button onPress={() => setActiveTab(1)}>second</Button>
//       </Flex>
//       {activeTab === 0 && (
//         <InfiniteScrollArtworksGridContainer connection={fairArtworks} isLoading={() => false} hasMore={() => {}} />
//       )}
//       {activeTab === 1 && (
//         <InfiniteScrollArtworksGridContainer connection={fairArtworks} isLoading={() => false} hasMore={() => {}} />
//       )}
//     </>
//   )
// }

// export const Fair2: React.FC<Fair2Props> = ({ fair, relay }) => {
//   const hasArticles = !!fair.articles?.edges?.length

//   console.log({ relay })
//   const sections = [
//     <Fair2HeaderFragmentContainer fair={fair} />,
//     ...(hasArticles ? [<Fair2EditorialFragmentContainer fair={fair} />] : []),
//     <OurTabs fairArtworks={fair.fairArtworks} relay={relay} />,
//   ]

//   const [scrollEnabled, setScrollEnabled] = useState(true)

//   const [offset, setOffset] = useState(0)

//   useEffect(() => {
//     if (offset > 1000) {
//       setScrollEnabled(false)
//     }
//   }, [offset])

//   return (
//     <Theme>
//       <FlatList
//         data={sections}
//         ItemSeparatorComponent={() => <Separator my={3} />}
//         keyExtractor={(_item, index) => String(index)}
//         renderItem={({ item }) => item}
//         scrollEnabled={scrollEnabled}
//         onScroll={(e) => setOffset(e.nativeEvent.contentOffset.y)}
//       />
//     </Theme>
//   )
// }

// export const Fair2FragmentContainer = createFragmentContainer(Fair2, {
//   fair: graphql`
//     fragment Fair2_fair on Fair {
//       fairArtworks: filterArtworksConnection(first: 20) {
//         edges {
//           node {
//             id
//           }
//         }
//         counts {
//           total
//         }
//         ...InfiniteScrollArtworksGrid_connection
//       }

//       articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
//         edges {
//           __typename
//         }
//       }
//       ...Fair2Header_fair
//       ...Fair2Editorial_fair
//     }
//   `,
// })

// export const Fair2QueryRenderer: React.FC<Fair2QueryRendererProps> = ({ fairID }) => {
//   return (
//     <QueryRenderer<Fair2Query>
//       environment={defaultEnvironment}
//       query={graphql`
//         query Fair2Query($fairID: String!) {
//           fair(id: $fairID) @principalField {
//             ...Fair2_fair
//           }
//         }
//       `}
//       variables={{ fairID }}
//       render={renderWithLoadProgress(Fair2FragmentContainer)}
//     />
//   )
// }
