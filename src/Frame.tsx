import * as React from 'react';

import { classNames } from './classNames';
import { Spinner } from './Spinner';

export interface FrameProps {
    setFrameHeight?(doc: Document): number;
    url: string;
}

const FRAME_RESIZE_KEY = 'FRAME_RESIZE';

export const Frame: React.FC<FrameProps> = ({ setFrameHeight, url }) => {
    const [loaded, setLoaded] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>();
    const frameRef = React.useRef<HTMLIFrameElement>();

    const updateHeight = () => {
        const container = containerRef.current;
        const frameEle = frameRef.current;
        if (!container || !frameEle) {
            return;
        }
        const frameDoc = frameEle.contentDocument;
        const height = setFrameHeight ? setFrameHeight(frameDoc) : frameDoc.documentElement.scrollHeight;
        if (height > 0) {
            container.style.height = `${height}px`;
        }
    };

    const handleOnLoad = () => {
        setLoaded(true);
        const frameEle = frameRef.current;
        if (!frameEle) {
            return;
        }
        const doc = frameEle.contentDocument;
        const script = doc.createElement('script');
        script.append(`
const io = new ResizeObserver(entries => {
    entries.forEach((entry) => {
        window.parent.postMessage({
            channel: '${FRAME_RESIZE_KEY}',
            sender: '${url}', 
            data: true,
        }, window.location.origin);
    });
});
io.observe(document.body);`);
        doc.documentElement.appendChild(script);

        const link = doc.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', '/assets/demo.css');
        doc.head.appendChild(link);

        // Fit the frame
        updateHeight();
    };

    React.useEffect(() => {
        const frameEle = frameRef.current;
        if (!frameEle) {
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // The iframe is visible
                        const ele = entry.target;
                        if (ele.getAttribute('data-src')) {
                            ele.setAttribute('src', ele.getAttribute('data-src'));
                            ele.removeAttribute('data-src');
                        }
                        io.unobserve(ele);
                    }
                });
            },
            {
                threshold: 0,
            }
        );

        io.observe(frameEle);

        return (): void => {
            io.disconnect();
        };
    }, []);

    React.useEffect(() => {
        const onMessage = (e) => {
            if (e.data.channel === FRAME_RESIZE_KEY && e.data.sender === url) {
                updateHeight();
            }
        };
        window.addEventListener('message', onMessage);
        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, []);

    return (
        <div className="mgf-frame" ref={containerRef}>
            {!loaded && (
                <div className="mgf-frame__loader">
                    <Spinner />
                </div>
            )}
            <iframe
                className={classNames({
                    'mgf-frame__body': true,
                    'mgf-frame__body--loaded': loaded,
                })}
                ref={frameRef}
                data-src={url}
                onLoad={handleOnLoad}
            />
        </div>
    );
};
