/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2_fair = {
    readonly fairArtworks: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
            } | null;
        } | null> | null;
        readonly counts: {
            readonly total: number | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"InfiniteScrollArtworksGrid_connection">;
    } | null;
    readonly articles: {
        readonly edges: ReadonlyArray<{
            readonly __typename: string;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Header_fair" | "Fair2Editorial_fair">;
    readonly " $refType": "Fair2_fair";
};
export type Fair2_fair$data = Fair2_fair;
export type Fair2_fair$key = {
    readonly " $data"?: Fair2_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2_fair">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Fair2_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "fairArtworks",
      "name": "filterArtworksConnection",
      "storageKey": "filterArtworksConnection(first:20)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "FilterArtworksEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artwork",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "id",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "counts",
          "storageKey": null,
          "args": null,
          "concreteType": "FilterArtworksCounts",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "total",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "FragmentSpread",
          "name": "InfiniteScrollArtworksGrid_connection",
          "args": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "articles",
      "name": "articlesConnection",
      "storageKey": "articlesConnection(first:5,sort:\"PUBLISHED_AT_DESC\")",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 5
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "PUBLISHED_AT_DESC"
        }
      ],
      "concreteType": "ArticleConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArticleEdge",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "__typename",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2Header_fair",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2Editorial_fair",
      "args": null
    }
  ]
};
(node as any).hash = '552a1b18f7ac8d1ed8d08526abf662db';
export default node;
