import { MyCollectionArtworkHeaderTestsQuery } from "__generated__/MyCollectionArtworkHeaderTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkHeaderFragmentContainer } from "../MyCollectionArtworkHeader"

describe("MyCollectionArtworkHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => {
    return (
      <QueryRenderer<MyCollectionArtworkHeaderTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query MyCollectionArtworkHeaderTestsQuery @relay_test_operation {
            artwork(id: "some-slug") {
              ...MyCollectionArtworkHeader_artwork
            }
          }
        `}
        variables={{}}
        render={({ props, error }) => {
          console.log("-------------------------")
          if (error) {
            console.log(error)
          }
          if (props?.artwork) {
            return <MyCollectionArtworkHeaderFragmentContainer artwork={props.artwork} />
          }
          return null
        }}
      />
    )
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders correct components", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          artistNames: "some artist name",
          date: "Jan 20th",
          image: {
            url: "some/url",
          },
          title: "some title",
        }),
      })
    )

    expect(extractText(wrapper.root)).toContain("some artist name")
    expect(extractText(wrapper.root)).toContain("some title, Jan 20th")
    expect(wrapper.root.findAllByType(OpaqueImageView)).toBeDefined()
  })
})
