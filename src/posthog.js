import posthog from 'posthog-js';

if (typeof window !== 'undefined' && !posthog.__loaded) {
    if (import.meta.env.VITE_NODE_ENV === 'development') {
        posthog.debug();
    }

    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
        api_host: 'https://app.posthog.com',
        autocapture: true,
        session_recording: {
            enabled: false,
            maskAllInputs: false,
            maskInputOptions: {
                password: true,
                email: false
            }
        },
        capture_pageview: true,
        persistence: 'localStorage',
        loaded: (ph) => {
            if (import.meta.env.VITE_NODE_ENV === 'development') {
                window.posthog = ph;
            }
        }
    });

    posthog.startSessionRecording();
}

export default posthog;
