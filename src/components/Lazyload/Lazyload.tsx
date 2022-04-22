import React, { Suspense } from 'react';
import Loading from './Loading';

export default function (loader: any) {
    const OtherComponent = React.lazy(loader);
    return function MyComponent(props: any) {
        return (
            <Suspense fallback={<Loading />}>
                <OtherComponent {...props} />
            </Suspense>
        );
    };
}