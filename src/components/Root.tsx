import {SDKProvider, useLaunchParams} from '@telegram-apps/sdk-react';
import {THEME, TonConnectUIProvider} from '@tonconnect/ui-react';
import {Provider as ReduxProvider} from 'react-redux';
import {type FC, useEffect, useMemo} from 'react';

import {App} from '@/components/App.tsx';
import {ErrorBoundary} from '@/components/ErrorBoundary.tsx';
import {store} from "@/store";

const ErrorBoundaryError: FC<{ error: unknown }> = ({error}) => (
  <div>
    <p>An unhandled error occurred:</p>
    <blockquote>
      <code>
        {error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : JSON.stringify(error)}
      </code>
    </blockquote>
  </div>
);

const Inner: FC = () => {
  const debug = useLaunchParams().startParam === 'debug';
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (debug) {
      import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
    <TonConnectUIProvider uiPreferences={{theme: THEME.LIGHT}} manifestUrl={manifestUrl}>
      <SDKProvider acceptCustomStyles debug={debug}>
        <ReduxProvider store={store}>
          <App/>
        </ReduxProvider>
      </SDKProvider>
    </TonConnectUIProvider>
  );
};

export const Root: FC = () => (
  <ErrorBoundary fallback={ErrorBoundaryError}>
    <Inner/>
  </ErrorBoundary>
);