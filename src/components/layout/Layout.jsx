import { Outlet } from 'react-router-dom';
import Navebar from '../naveBar/Navebar';
import NexeusFooter from '../footer/NexeusFooter';

/**
 * Global Layout — wraps every route that needs the shared
 * Navbar at the top and Footer at the bottom.
 * Auth and 404 pages are intentionally excluded from this layout.
 */
export default function Layout() {
  return (
    <>
      <Navebar />
      <Outlet />
      <NexeusFooter />
    </>
  );
}
