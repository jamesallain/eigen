import { AppStoreProvider } from "lib/store/AppStore"
import { Theme } from "palette"
import React from "react"
import ReactTestRenderer from "react-test-renderer"
import { ReactElement } from "simple-markdown"

/**
 * Renders a React Component with our page wrappers
 * only <Theme> for now
 * @param component
 */
export const renderWithWrappers = (component: ReactElement) => {
  const wrappedComponent = componentWithWrappers(component)
  try {
    // tslint:disable-next-line:use-wrapped-components
    const renderedComponent = ReactTestRenderer.create(wrappedComponent)

    // monkey patch update method to wrap components
    const originalUpdate = renderedComponent.update
    renderedComponent.update = (nextElement: ReactElement) => {
      originalUpdate(componentWithWrappers(nextElement))
    }

    return renderedComponent
  } catch (error) {
    if (error.message.includes("Element type is invalid")) {
      throw new Error(
        'Error: Relay test component failed to render. Did you forget to add `jest.unmock("react-relay")` at the top ' +
          "of your test?" +
          "\n\n" +
          error
      )
    } else {
      throw new Error(error.message)
    }
  }
}

/**
 * Returns given component wrapped with our page wrappers
 * only <Theme> for now
 * @param component
 */
export const componentWithWrappers = (component: ReactElement) => {
  return (
    <AppStoreProvider>
      <Theme>{component}</Theme>
    </AppStoreProvider>
  )
}
