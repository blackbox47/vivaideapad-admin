import { useCallback } from 'react';

import { closeMobileNav, setMobileNavOpen } from '@/reducers/ui-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface UseMobileNavResult {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
}

export default function useMobileNav(): UseMobileNavResult {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.mobileNavOpen);

  const setOpen = useCallback(
    (open: boolean) => {
      dispatch(setMobileNavOpen(open));
    },
    [dispatch],
  );

  const close = useCallback(() => {
    dispatch(closeMobileNav());
  }, [dispatch]);

  return { isOpen, setOpen, close };
}
