import * as React from 'react';

export interface FrameProps {
    setFrameHeight?(doc: Document): number;
    url: string;
}

export class Frame extends React.Component<FrameProps> {}
