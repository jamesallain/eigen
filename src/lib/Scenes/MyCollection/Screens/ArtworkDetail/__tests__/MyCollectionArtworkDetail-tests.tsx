import React from "react"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { MyCollectionArtworkInsightsFragmentContainer } from "../Components/ArtworkInsights/MyCollectionArtworkInsights"
import { MyCollectionArtworkHeaderFragmentContainer } from "../Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkMetaFragmentContainer } from "../Components/MyCollectionArtworkMeta"
import { tests } from "../MyCollectionArtworkDetail"

jest.mock("../Components/MyCollectionArtworkHeader", () => ({
  MyCollectionArtworkHeader: () => null,
}))

jest.mock("../Components/MyCollectionArtworkMetaFragmentContainer", () => ({
  MyCollectionArtworkMetaFragmentContainer: () => null,
}))

jest.mock("../Components/MyCollectionArtworkInsightsFragmentContainer", () => ({
  MyCollectionArtworkInsightsFragmentContainer: () => null,
}))

describe("MyCollectionArtworkDetail", () => {
  it("renders correct components", () => {
    const wrapper = renderWithWrappers(<tests.MyCollectionArtworkDetail artwork={null} marketPriceInsights={null} />)
  })
})
