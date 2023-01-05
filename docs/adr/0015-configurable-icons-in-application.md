# Where images are stored

Date: 2023-01-04

## Status

2023-01-04: Accepted

## Context

In addition to how we store images as explained in [0013-move-images-to-webroot.md](./0013-move-images-to-webroot.md) we also store the images for the icons of the meldingenkaart on Django. This is done without a feature flag.

The reason for storing these on the Django is that application managers of municipalities are capable of changing the icons if so desired without the need for developers. 

## Decision

Images for the meldingenkaart are stored on Django without a feauture flag. 
