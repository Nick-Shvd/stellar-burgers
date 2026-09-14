import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector} from '../../services/store';
import { userSlice} from '../../services/user-slice';

export const AppHeader: FC = () => {
    const user = useSelector(userSlice.selectors.selectUser);

return <AppHeaderUI userName= {user?.name} 
/>
}
