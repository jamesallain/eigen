import { MyCollectionArtworkArtistArticlesTestsQuery } from "__generated__/MyCollectionArtworkArtistArticlesTestsQuery.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
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
    expect(wrapper.root.findByType(OpaqueImageView)).toBeDefined()
    const text = extractText(wrapper.root)
    expect(text).toContain("Latest Articles")
    expect(text).toContain("thumbnailTitle")
    expect(text).toContain("publishedAt")
  })

  it("navigates to correct article on click", () => {
    const spy = jest.fn()
    AppStore.actions.myCollection.navigation.navigateToArticleDetail = spy as any
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress()
    expect(spy).toHaveBeenCalledWith('<mock-value-for-field-"slug">')
  })

  it("navigates to all articles on click", () => {
    const spy = jest.fn()
    AppStore.actions.myCollection.navigation.navigateToAllArticles = spy as any
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      Artist: () => ({
        slug: "artist-slug",
      }),
    })
    wrapper.root.findAllByType(CaretButton)[0].props.onPress()
    expect(spy).toHaveBeenCalledWith("artist-slug")
  })
})
