# Fork of @axa-fr/react-oidc - https://github.com/AxaGuilDEv/react-oidc

## Changes: 
- adds ability to pass params to the /authorize endpoint
- adds onRedirectCallback prop to allow functions to be called from redirect component



[![Build status](https://dev.azure.com/axaguildev/react-oidc/_apis/build/status/AxaGuilDEv.react-oidc?branch=master)](https://dev.azure.com/axaguildev/react-oidc/_build)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_react-oidc&metric=alert_status)](https://sonarcloud.io/dashboard?id=AxaGuilDEv_react-oidc) [![Reliability](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_react-oidc&metric=reliability_rating)](https://sonarcloud.io/component_measures?id=AxaGuilDEv_react-oidc&metric=reliability_rating) [![Security](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_react-oidc&metric=security_rating)](https://sonarcloud.io/component_measures?id=AxaGuilDEv_react-oidc&metric=security_rating) [![Code Corevage](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_react-oidc&metric=coverage)](https://sonarcloud.io/component_measures?id=AxaGuilDEv_react-oidc&metric=Coverage) [![Twitter](https://img.shields.io/twitter/follow/GuildDEvOpen?style=social)](https://twitter.com/intent/follow?screen_name=GuildDEvOpen)

- [About](#about)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- Packages
  - [`react-oidc-context-params-redirect`](./packages/context#readme.md) [![npm version](https://badge.fury.io/js/%40axa-fr%2Freact-oidc-context.svg)](https://badge.fury.io/js/%40axa-fr%2Freact-oidc-context)
- [Concepts](#concepts)
- [Contribute](#contribute)

## About

These components is used to manage client authentication.
It uses the libraries ["oidc client"](https://github.com/IdentityModel/oidc-client-js).

Two version of the component with different "State management" are available :

- with redux
- with react context api

## Getting Started

- [`react-oidc-context-params-redirect`](./packages/context#readme)

## How It Works

These components encapsulate the use of "oidc client" in order to hide workfow complexity.
Internally, native History API is used to be router library agnostic.

## Concept

A set of react components and HOC to make Oidc client easy!

The purpose of the component is :

- Simple set up
- React component protection (by composing)
- Standardize the "Routes" used by the oauth flow
- Manage the recovery of tokens and different exchanges with "openid connect" server
- Flexible : You can customize routes and redirect components if you need it
- HOC => override "fetch" in order to retrieve a new "fetch" that will be able to manage http 401 and http 403 response.

## Contribute

- [How to run the solution and to contribute](./CONTRIBUTING.md)
- [Please respect our code of conduct](./CODE_OF_CONDUCT.md)
