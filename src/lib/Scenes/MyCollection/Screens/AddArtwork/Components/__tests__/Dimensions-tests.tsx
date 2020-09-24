import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Dimensions } from "../Dimensions"

jest.mock("../../Form/useArtworkForm")

describe("Dimensions", () => {
  it("displays correct dimensions", () => {
    const wrapper = renderWithWrappers(<Dimensions />)
  })
})
