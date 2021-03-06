import { Fair2HeaderTestsQuery, Fair2HeaderTestsQueryRawResponse } from "__generated__/Fair2HeaderTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { Fair2Header, Fair2HeaderFragmentContainer } from "lib/Scenes/Fair2/Components/Fair2Header"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

describe("Fair2Header", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<Fair2HeaderTestsQuery>
      environment={env}
      query={graphql`
        query Fair2HeaderTestsQuery($fairID: String!) @raw_response_type {
          fair(id: $fairID) {
            ...Fair2Header_fair
          }
        }
      `}
      variables={{ fairID: "art-basel-hong-kong-2020" }}
      render={({ props, error }) => {
        if (props?.fair) {
          return <Fair2HeaderFragmentContainer fair={props.fair} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (fixture: Fair2HeaderTestsQueryRawResponse = Fair2HeaderFixture) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...fixture,
        },
      })
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(Fair2Header)).toHaveLength(1)
  })

  it("renders the fair title", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findByProps({ variant: "largeTitle" }).props.children).toBe("Art Basel Hong Kong 2020")
  })

  it("renders the fair main image", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(OpaqueImageView)[0].props.imageURL).toBe(
      "https://testing.artsy.net/art-basel-hong-kong-image"
    )
  })

  it("renders the fair icon", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(OpaqueImageView)[1].props.imageURL).toBe(
      "https://testing.artsy.net/art-basel-hong-kong-icon"
    )
  })

  it("renders the fair description", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findByProps({ variant: "text" }).props.children).toBe("The biggest art fair in Hong Kong")
  })

  it("falls back to About when Summary isn't available", () => {
    const wrapper = getWrapper(Fair2HeaderFixtureNoSummary)
    expect(wrapper.root.findByProps({ variant: "text" }).props.children).toBe("A great place to buy art")
  })

  it("navigates to the fair info page on press of More Info", () => {
    const wrapper = getWrapper().root.findByType(TouchableOpacity)
    wrapper.props.onPress()
    expect(navigate).toHaveBeenCalledWith("/fair2/art-basel-hong-kong-2020/info")
  })

  it("does not show the More Info link if there is no info to show", () => {
    const wrapper = getWrapper(Fair2HeaderFixtureNoAdditionalInfo)
    expect(wrapper.root.findAllByType(TouchableOpacity).length).toBe(0)
  })
})

const Fair2HeaderFixture: Fair2HeaderTestsQueryRawResponse = {
  fair: {
    name: "Art Basel Hong Kong 2020",
    slug: "art-basel-hong-kong-2020",
    about: "A great place to buy art",
    summary: "The biggest art fair in Hong Kong",
    id: "xyz123",
    image: {
      aspectRatio: 1,
      url: "https://testing.artsy.net/art-basel-hong-kong-image",
    },
    location: {
      id: "cde123",
      summary: null,
    },
    profile: {
      id: "abc123",
      icon: {
        url: "https://testing.artsy.net/art-basel-hong-kong-icon",
      },
    },
    tagline: "",
    links: null,
    contact: null,
    hours: null,
    tickets: null,
    ticketsLink: "",
  },
}

const Fair2HeaderFixtureNoSummary = {
  fair: {
    ...Fair2HeaderFixture.fair,
    summary: "",
  },
} as Fair2HeaderTestsQueryRawResponse

const Fair2HeaderFixtureNoAdditionalInfo = {
  fair: {
    ...Fair2HeaderFixture.fair,
    about: "",
    summary: "",
  },
} as Fair2HeaderTestsQueryRawResponse
