import ItemsTable from '@common/components/partials/ItemsTable';
import { Client } from '@modules/users/defs/types';
import { ClientsApiRoutes } from '@modules/clients/defs/api-routes';
import { ClientsRoutes } from '@modules/clients/defs/routes';
import useItems from '@common/hooks/useItems';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';
import { Any, CrudRow } from '@common/defs/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Visibility } from '@mui/icons-material';
import { useRouter } from 'next/router';

interface Row extends CrudRow {
  email: string;
  createdAt: string;
  companyName: string;
  industry: string;
  projectCount: number;
}

const ClientsTable = () => {
  const { t, i18n } = useTranslation(['user']);
  const router = useRouter();
  const actions = [
    {
      label: t('user:list.view_details'),
      icon: <Visibility fontSize="small" />,
      onClick: (id: number) => {
        router.push(`/clients/${id}`);
      },
    },
  ];
  const columns: GridColumns<Row> = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'email', headerName: t('user:list.email'), flex: 1 },
    { field: 'companyName', headerName: t('user:list.company_name') || 'Company', flex: 1 },
    { field: 'industry', headerName: t('user:list.industry') || 'Industry', width: 150 },
    { field: 'projectCount', headerName: t('user:list.project_count') || 'Projects', width: 120 },
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

  const itemToRow = (item: Client): Row => {
    const user = item.user || {};
    return {
      id: item.id,
      userId: user.id || item.id,
      email: user.email || '',
      createdAt: user.createdAt || '',
      companyName: item.companyName || '',
      industry: item.industry || '',
      projectCount: item.projectCount || 0,
    };
  };

  const useClients = (options?: Any) => useItems(ClientsApiRoutes, options);

  return (
    <ItemsTable<Any, Any, Any, Row>
      namespace={Namespaces.Users}
      routes={ClientsRoutes}
      useItems={useClients}
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

export default ClientsTable;
