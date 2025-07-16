import ItemsTable from '@common/components/partials/ItemsTable';
import { Ambassador } from '@modules/users/defs/types';
import { AmbassadorsApiRoutes } from '@modules/ambassadors/defs/api-routes';
import { AmbassadorsRoutes } from '@modules/ambassadors/defs/routes';
import useItems from '@common/hooks/useItems';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';
import { CrudRow } from '@common/defs/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { CheckCircle, Cancel, VerifiedUser, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/router';

interface Row extends CrudRow {
  email: string;
  createdAt: string;
  applicationStatus: string;
  teamName: string;
  clientCount: number;
}

const AmbassadorsTable = () => {
  const { t, i18n } = useTranslation(['user']);
  const router = useRouter();
  const actions = [
    {
      label: 'View Details',
      icon: <Visibility fontSize="small" />,
      onClick: (id: number, item: any) => {
        const userId = item.user?.id || item.id;
        router.push(`/ambassadors/${userId}`);
      },
    },
  ];
  const columns: GridColumns<Row> = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'email', headerName: t('user:list.email'), flex: 1 },
    {
      field: 'applicationStatus',
      headerName: t('user:list.application_status') || 'Status',
      width: 150,
      renderCell: (params) => {
        const status = params.row.applicationStatus;
        if (status === 'APPROVED') {
          return <CheckCircle color="success" />;
        }
        if (status === 'PENDING') {
          return <VerifiedUser color="warning" />;
        }
        return <Cancel color="error" />;
      },
    },
    { field: 'teamName', headerName: t('user:list.team_name') || 'Team', width: 150 },
    { field: 'clientCount', headerName: t('user:list.client_count') || 'Clients', width: 120 },
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
    // item is an ambassador record with a related user
    const user = item.user || {};
    return {
      id: item.id,
      userId: user.id || item.id,
      email: user.email || '',
      createdAt: user.createdAt || '',
      applicationStatus: item.applicationStatus || 'PENDING',
      teamName: item.teamName || '',
      clientCount: item.clientCount || 0,
    };
  };

  const useAmbassadors = (options?: any) => useItems(AmbassadorsApiRoutes, options);

  return (
    <ItemsTable<any, any, any, Row>
      namespace={Namespaces.Users}
      routes={AmbassadorsRoutes}
      useItems={useAmbassadors}
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

export default AmbassadorsTable;
