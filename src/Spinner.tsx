import * as React from 'react';

import { classNames } from './classNames';

export const Spinner: React.FC = () => {
    const containerRef = React.useRef<HTMLDivElement>();
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setVisible(entry.isIntersecting);
                });
            },
            {
                threshold: 0,
            }
        );
        io.observe(container);

        return (): void => {
            io.unobserve(container);
        };
    }, []);

    return (
        <div
            className={classNames({
                'mgf-spinner': true,
                'mgf-spinner--animating': visible,
            })}
            ref={containerRef}
        />
    );
};
