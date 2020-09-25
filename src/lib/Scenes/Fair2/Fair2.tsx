import { Fair2_fair } from "__generated__/Fair2_fair.graphql"
import { Fair2Query } from "__generated__/Fair2Query.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { SnappyHorizontalRail } from "lib/Components/StickyTabPage/SnappyHorizontalRail"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import _ from "lodash"
import { Button, Flex, Separator, Spacer, Theme } from "palette"
import { eventNames } from "process"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { FlatList, ScrollView, Text, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { Fair2EditorialFragmentContainer } from "./Components/Fair2Editorial"
import { Fair2HeaderFragmentContainer } from "./Components/Fair2Header"

interface Fair2QueryRendererProps {
  fairID: string
}

interface Fair2Props {
  fair: Fair2_fair
  relay: RelayPaginationProp
}

export const Fair2: React.FC<Fair2Props> = ({ fair, relay }) => {
  const hasArticles = !!fair.articles?.edges?.length

  const [scrollEnabled, setScrollEnabled] = useState(true)
  const offset = useRef(0)
  const [offset2, setOffset2] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [show, setShow] = useState(false)

  const OurTabs = () => {
    return (
      <>
        <Flex flexDirection="row" style={{ backgroundColor: "red" }}>
          <Button onPress={() => setActiveTab(0)}>first</Button>
          <Button onPress={() => setActiveTab(1)}>second</Button>
        </Flex>
        {activeTab === 0 && (
          <InfiniteScrollArtworksGridContainer
            connection={fair.fairArtworks}
            isLoading={() => false}
            hasMore={() => {}}
          />
        )}
        {activeTab === 1 && (
          <InfiniteScrollArtworksGridContainer
            connection={fair.fairArtworks}
            isLoading={() => false}
            hasMore={() => {}}
          />
        )}
      </>
    )
  }

  const sections = [
    <Fair2HeaderFragmentContainer fair={fair} />,
    ...(hasArticles ? [<Fair2EditorialFragmentContainer fair={fair} />] : []),
    <OurTabs />,
  ]

  // const updateRef = useCallback((node) => {
  //   console.log("wow")
  //   if (node !== null) {
  //     console.log("wow33")
  //     setOffset2(offset.current)
  //   }
  // }, [])

  useEffect(() => {
    // console.log(offset2)
    if (offset2 > 1000) {
      setShow(true)
    }
  }, [offset2])

  return (
    <Theme>
      <>
        <FlatList
          data={sections}
          ItemSeparatorComponent={() => <Separator my={3} />}
          keyExtractor={(_item, index) => String(index)}
          renderItem={({ item }) => item}
          // scrollEnabled={scrollEnabled}
          // ref={updateRef}
          scrollEventThrottle={16}
          onScroll={(e) => {
            // _.throttle(() => {
            setOffset2(e.nativeEvent.contentOffset.y)
            console.log(offset2)
            // }, 200)
            // offset.current = e.nativeEvent.contentOffset.y
          }}
        />
        {show && (
          <Flex flexDirection="row" style={{ position: "absolute", top: 60 }}>
            <Button onPress={() => setActiveTab(0)}>first</Button>
            <Button onPress={() => setActiveTab(1)}>second</Button>
          </Flex>
        )}
      </>
    </Theme>
  )
}

export const Fair2FragmentContainer = createFragmentContainer(Fair2, {
  fair: graphql`
    fragment Fair2_fair on Fair {
      fairArtworks: filterArtworksConnection(first: 20) {
        edges {
          node {
            id
          }
        }
        counts {
          total
        }
        ...InfiniteScrollArtworksGrid_connection
      }

      articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
        edges {
          __typename
        }
      }
      ...Fair2Header_fair
      ...Fair2Editorial_fair
    }
  `,
})

export const Fair2QueryRenderer: React.FC<Fair2QueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<Fair2Query>
      environment={defaultEnvironment}
      query={graphql`
        query Fair2Query($fairID: String!) {
          fair(id: $fairID) @principalField {
            ...Fair2_fair
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithLoadProgress(Fair2FragmentContainer)}
    />
  )
}
