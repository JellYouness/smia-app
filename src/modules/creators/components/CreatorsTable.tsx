import ItemsTable from '@common/components/partials/ItemsTable';
import { CreatorsRoutes } from '@modules/creators/defs/routes';
import useItems from '@common/hooks/useItems';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';
import { CrudRow } from '@common/defs/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { CheckCircle, Cancel, VerifiedUser, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/router';
import ApiRoutes from '../defs/api-routes';

interface Row extends CrudRow {
  email: string;
  createdAt: string;
  verificationStatus: string;
  experience: number;
  averageRating: number;
}

const CreatorsTable = () => {
  const { t, i18n } = useTranslation(['user']);
  const router = useRouter();
  const actions = [
    {
      label: t('user:list.view_details'),
      icon: <Visibility fontSize="small" />,
      onClick: (id: number) => {
        router.push(`/creators/${id}`);
      },
    },
  ];
  const columns: GridColumns<Row> = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'email', headerName: t('user:list.email'), flex: 1 },
    {
      field: 'verificationStatus',
      headerName: t('user:list.verification_status') || 'Verification',
      width: 150,
      renderCell: (params) => {
        const status = params.row.verificationStatus;
        if (status === 'VERIFIED') {
          return <CheckCircle color="success" />;
        }
        if (status === 'PENDING') {
          return <VerifiedUser color="warning" />;
        }
        return <Cancel color="error" />;
      },
    },
    { field: 'experience', headerName: t('user:list.experience') || 'Experience', width: 120 },
    { field: 'averageRating', headerName: t('user:list.rating') || 'Rating', width: 120 },
    {
      field: 'createdAt',
      headerName: t('user:list.created_at'),
      type: 'dateTime',
      flex: 1,
      renderCell: (params) => dayjs(params.row.createdAt).format('DD/MM/YYYY hh:mm'),
    },
  ];
  const [translatedColumns, setTranslatedColumns] = useState<GridColumns<Row>>(columns);
  useEffect(() => {
    setTranslatedColumns(columns);
  }, [t, i18n.language]);

  const itemToRow = (item: any): Row => {
    // item is a creator record with a related user
    const user = item.user || {};
    return {
      id: item.id,
      userId: user.id || item.id,
      email: user.email || '',
      createdAt: user.createdAt || '',
      verificationStatus: item.verificationStatus || 'UNVERIFIED',
      experience: item.experience || 0,
      averageRating: item.averageRating || 0,
    };
  };

  const useCreators = (options?: any) => useItems(ApiRoutes, options);

  return (
    <ItemsTable<any, any, any, Row>
      namespace={Namespaces.Users}
      routes={CreatorsRoutes}
      useItems={useCreators}
      columns={translatedColumns}
      itemToRow={itemToRow}
      actions={actions}
      showEdit={() => true}
      showDelete={() => true}
      showLock
      exportable
    />
  );
};

export default CreatorsTable;
