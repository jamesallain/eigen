import { MyCollectionArtworkMetaTestsQuery } from "__generated__/MyCollectionArtworkMetaTestsQuery.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { AppStore } from "lib/store/AppStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkMetaFragmentContainer } from "../MyCollectionArtworkMeta"

jest.unmock("react-relay")

describe("MyCollectionArtworkMeta", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = (passedProps: { viewAll: boolean }) => (
    <QueryRenderer<MyCollectionArtworkMetaTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkMetaTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...MyCollectionArtworkMeta_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionArtworkMetaFragmentContainer artwork={props.artwork} viewAll={passedProps.viewAll} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const sharedArtworkProps = {
    artist: {
      internalID: "foo",
    },
    artistNames: "some artist name",
    category: "Painting",
    costMinor: 200,
    costCurrencyCode: "USD",
    date: "Jan 20th",
    height: 20,
    width: 30,
    depth: 40,
    id: "some-id",
    image: {
      url: "some-image-url",
    },
    internalID: "some-internal-id",
    medium: "oil",
    metric: "in",
    slug: "some-slug",
    title: "some title",
  }

  const resolveData = () => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Artwork: () => sharedArtworkProps,
      })
    )
  }

  describe("component states", () => {
    describe("small version", () => {
      it("renders correct fields", () => {
        const wrapper = renderWithWrappers(<TestRenderer viewAll={false} />)
        resolveData()

        const text = extractText(wrapper.root)
        expect(text).toContain("Category")
        expect(text).toContain("Oil")
        expect(text).toContain("Dimension")
        expect(text).toContain("20 × 30 × 40 in")
        expect(text).toContain("Edition")
        expect(text).toContain("TODO")
        expect(text).toContain("Price paid")
        expect(text).toContain("200 USD")
      })

      it("fires the naviggateToViewAllArtworkDetails action on button click", () => {
        const spy = jest.fn()
        AppStore.actions.myCollection.navigation.navigateToViewAllArtworkDetails = spy as any
        const wrapper = renderWithWrappers(<TestRenderer viewAll={false} />)
        resolveData()
        wrapper.root.findByType(CaretButton).props.onPress()
        expect(spy).toHaveBeenCalledWith({
          passProps: {
            artwork: sharedArtworkProps,
          },
        })
      })
    })

    describe("large version", () => {
      it("renders correct fields", () => {
        const wrapper = renderWithWrappers(<TestRenderer viewAll />)
        resolveData()

        const text = extractText(wrapper.root)
        expect(text).toContain("Artist")
        expect(text).toContain("some artist name")
        expect(text).toContain("Title")
        expect(text).toContain("some title")
        expect(text).toContain("Year created")
        expect(text).toContain("Jan 20th")
        expect(text).toContain("Category")
        expect(text).toContain("Oil")
        expect(text).toContain("Materials")
        expect(text).toContain("Painting")
        expect(text).toContain("Dimension")
        expect(text).toContain("20 × 30 × 40 in")
        expect(text).toContain("Edition")
        expect(text).toContain("TODO")
        expect(text).toContain("Price paid")
        expect(text).toContain("200 USD")
      })
    })
  })
})
