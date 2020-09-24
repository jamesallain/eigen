import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Dimensions } from "react-native"
import { AddEditArtwork, tests } from "../AddEditArtwork"
import { ArtistAutosuggest } from "../Components/ArtistAutosuggest"
import { MediumPicker } from "../Components/MediumPicker"

jest.mock("../Form/useArtworkForm", () => ({
  useArtworkForm: () => ({
    values: {},
    formik: {},
  }),
}))

describe("AddEditArtwork", () => {
  it("renders correct components", () => {
    const wrapper = renderWithWrappers(<AddEditArtwork />)
    const CompleteButton = wrapper.root.findByProps({ "data-test": "CompleteButton" })
    const expected = [
      FancyModalHeader,
      ArtistAutosuggest,
      MediumPicker,
      Dimensions,
      tests.PhotosButton,
      tests.AdditionalDetailsButton,
      CompleteButton,
    ]
    expected.forEach((Component) => {
      expect(Component).toBeDefined()
    })
  })
})
