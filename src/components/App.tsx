import { useIntegration } from '@telegram-apps/react-router-integration';
import {
  bindViewportCSSVars,
  initNavigator,
  useViewport,
} from '@telegram-apps/sdk-react';
import { type FC, useEffect, useMemo } from 'react';
import {
  Navigate,
  Route,
  Router,
  Routes,
} from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';
import TabBar from "@/components/TabBar/TabBar.tsx";
import TabBarItem from "@/components/TabBar/TabBarItem.tsx";
import {AboutIcon, HomeIcon} from "@/components/Icons/Icons.tsx";
import {toUserFriendlyAddress, useTonWallet} from "@tonconnect/ui-react";
import {useAppSelector} from "@/hooks/useAppSelector.ts";
import {useAppDispatch} from "@/hooks/useAppDispatch.ts";
import {fetchWalletInfoTC, setWalletAddress} from "@/store/reducers/appSlice.ts";


export const App: FC = () => {
  const viewport = useViewport();
  const wallet = useTonWallet()
  const dispatch = useAppDispatch()
  const {wallet_info} = useAppSelector(state => state.appSlice)

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  // Create a new application navigator and attach it to the browser history, so it could modify
  // it and listen to its changes.
  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const pathname = navigator.pathname
  const [location, reactNavigator] = useIntegration(navigator);

  // Don't forget to attach the navigator to allow it to control the BackButton state as well
  // as browser history.
  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  useEffect(() => {
    if (wallet?.account.address && !wallet_info) {
      const address  = toUserFriendlyAddress(wallet.account.address)
      Promise.all([
        dispatch(setWalletAddress(address)),
        dispatch(fetchWalletInfoTC({address})),
      ])
    }
  }, [wallet?.account.address]);

  return (
    <main>
      <Router location={location} navigator={reactNavigator}>
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path='*' element={<Navigate to='/'/>}/>
        </Routes>
        <TabBar>
          <TabBarItem text={'Home'} to={'/'}>
            <HomeIcon className={pathname === '/' ? 'home-active home-icon' : 'home-icon'}/>
          </TabBarItem>
          <TabBarItem text={'About'} to={'/about'}>
            <AboutIcon className={pathname === '/about' ? 'about-active home-icon' : 'home-icon'}/>
          </TabBarItem>
          {/*<TabBarItem text={'wallet'} to={'/ton-connect'}>
            <AboutIcon className={pathname === '/ton-connect' ? 'about-active' : ''}/>
          </TabBarItem>*/}
        </TabBar>
      </Router>
      {/*<Tabbar>
        <Tabbar.Item text={'Home'} selected={location.pathname === '/'} onClick={() => navigator.push('/')}>
          123
        </Tabbar.Item>
        <Tabbar.Item text={'theme-params'} selected={location.pathname === '/theme-params'} onClick={() => navigator.push('/theme-params')}>
          321
        </Tabbar.Item>
      </Tabbar>*/}
    </main>
  );
};
