/* eslint-disable max-len */

declare module '*.svg' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  export default ReactComponent;
}
declare module '*.png' {
  const src: string;
  export default src;
}

// custom.d.ts

declare module '*.svg?url' {
  const content: string;
  export default content;
}
