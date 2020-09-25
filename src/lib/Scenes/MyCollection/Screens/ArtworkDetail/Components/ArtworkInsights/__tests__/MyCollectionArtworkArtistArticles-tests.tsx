import { MyCollectionArtworkArtistArticlesTestsQuery } from "__generated__/MyCollectionArtworkArtistArticlesTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { AppStore } from "lib/store/AppStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkArtistArticlesFragmentContainer } from "../MyCollectionArtworkArtistArticles"

jest.unmock("react-relay")

describe("MyCollectionArtworkArtistArticles", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkArtistArticlesTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkArtistArticlesTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...MyCollectionArtworkArtistArticles_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionArtworkArtistArticlesFragmentContainer artwork={props.artwork} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const resolveData = (passedProps = {}) => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, passedProps)
    )
  }

  it("renders without throwing an error", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    const text = extractText(wrapper.root)
    expect(text).toContain("Latest Articles")
  })

  it("navigates to correct article on click", () => {
    const spy = jest.fn()
    AppStore.actions.myCollection.navigation.navigateToArticleDetail = spy as any
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress()
    expect(spy).toHaveBeenCalledWith('<mock-value-for-field-"slug">')
  })
})
