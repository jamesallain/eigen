import { ConversationDetailsTestsQuery } from "__generated__/ConversationDetailsTestsQuery.graphql"
import { ArtworkInfo } from "lib/Components/Inbox/Conversations/ArtworkInfo"
import { FileDownload } from "lib/Components/Inbox/Conversations/Preview/Attachment/FileDownload"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { TouchableHighlight } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { ConversationDetailsFragmentContainer } from "../ConversationDetails"

jest.unmock("react-relay")

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
  presentModalViewController: jest.fn(),
}))

describe("ConversationDetailsFragmentContainer", () => {
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<ConversationDetailsTestsQuery>
      environment={env}
      query={graphql`
        query ConversationDetailsTestsQuery($conversationID: String!) @relay_test_operation {
          me {
            ...ConversationDetails_me
          }
        }
      `}
      variables={{ conversationID: "1" }}
      render={({ props, error }) => {
        if (props) {
          return <ConversationDetailsFragmentContainer me={props.me!} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("doesn't throw when rendered", () => {
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: meMock,
      })
    })
  })

  it("has clickable artwork info", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: meMock,
      })
    })
    const artworkInfo = tree.root.findByType(ArtworkInfo)
    expect(extractText(artworkInfo)).toContain("happy little accident")

    tree.root.findAllByType(TouchableHighlight)[0].props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/artwork/happy-little-accident"
    )
  })

  it("renders non-image attachments", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: meMock,
      })
    })
    const attachments = tree.root.findAllByType(FileDownload)
    expect(attachments.length).toBe(2)
  })

  it("renders support FAQ", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: meMock,
      })
    })

    tree.root.findAllByType(TouchableHighlight)[3].props.onPress()

    expect(SwitchBoard.presentModalViewController).toHaveBeenCalledWith(
      expect.anything(),
      "https://support.artsy.net/hc/en-us/sections/360008203054-Contact-a-gallery"
    )
  })
})

const messageMock = {
  attachments: [
    {
      id: "1",
      fileName: "happylittleaccident.txt",
      contentType: "txt",
    },
    {
      id: "2",
      fileName: "happybigaccident.txt",
      contentType: "image",
    },
  ],
}

const meMock = {
  me: {
    conversation: {
      internalID: "111",
      to: {
        name: "partner",
      },
      from: {
        email: "collector@example.com",
      },
      messagesConnection: {
        edges: [{ node: messageMock }, { node: messageMock }],
      },
      items: [
        {
          item: {
            __typename: "Artwork",
            title: "happy little accident",
            href: "/artwork/happy-little-accident",
            image: {
              thumbnailUrl: "http://example.com/image.png",
            },
          },
        },
      ],
    },
  },
}
