/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type LocationMap_location = {
    readonly id: string;
    readonly internalID: string;
    readonly city: string | null;
    readonly address: string | null;
    readonly address_2: string | null;
    readonly postal_code: string | null;
    readonly summary: string | null;
    readonly coordinates: {
        readonly lat: number | null;
        readonly lng: number | null;
    } | null;
    readonly " $refType": "LocationMap_location";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "LocationMap_location",
  "type": "Location",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "city",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "address",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "address_2",
      "name": "address2",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "postal_code",
      "name": "postalCode",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "summary",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "coordinates",
      "storageKey": null,
      "args": null,
      "concreteType": "LatLng",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "lat",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "lng",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '97d7c477cb6b64555c9a8b97b43ae1f5';
export default node;
