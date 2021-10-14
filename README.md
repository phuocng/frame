# Frame

A React component that wraps an `iframe` inside an element:

-   [x] The `iframe` is only loaded when it is visible in the screen
-   [x] The `iframe` is resized automatically when its content resizes

Due to the cross domain (CORS) issue, it only supports `iframe` whose `src` belongs to the same domain of your site.

This components have been used in some 1milligram's products such as [FormValidation](https://formvalidation.io)

https://raw.githubusercontent.com/1milligram/frame/main/assets/form-validation-demo.mp4

### Usage

1. Install the package:

```shell
$ npm install @1milligram/frame
```

2. Using the `Frame` component:

```js
import { Frame } from '@1milligram/frame';
import '@1milligram/frame/lib/styles/index.css';

<Frame url="/path/to/iframe" />;
```

### Options

**Setting the frame height**

For any reason that you would like to do your own calculation to adjust the frame height:

```js
const setFrameHeight = (doc: Document) => {
    // `doc` is the document instance of the iframe content
    return doc.body.scrollHeight;
};

<Frame setFrameHeight={setFrameHeight} />;
```
