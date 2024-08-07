import React, { useEffect } from 'react';

const Tawk = () => {
    useEffect(() => {
        // Load the Tawk.to script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://embed.tawk.to/66b04de532dca6db2cb9ff25/1i4gb0i0k';
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');
        script.async = true;
        document.body.appendChild(script);

        // Initialize Tawk.to API
        const Tawk_API = window.Tawk_API || {};
        Tawk_API.onLoad = () => {
            if (window.Tawk_API && window.Tawk_API.setOptions) {
                // Hide the default popup button
                window.Tawk_API.setOptions({
                    hideChatButton: true,
                });
            }
        };

        // Cleanup script on component unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}>
            {/* Add a container for the Tawk.to widget */}
            <div id="tawkchat-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {/* You can add additional styling if needed */}
            </div>
        </div>
    );
};

export default Tawk;
