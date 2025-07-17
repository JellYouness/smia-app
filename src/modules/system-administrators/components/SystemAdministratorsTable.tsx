import ItemsTable from '@common/components/partials/ItemsTable';
import { SystemAdministratorsApiRoutes } from '@modules/system-administrators/defs/api-routes';
import { SystemAdministratorsRoutes } from '@modules/system-administrators/defs/routes';
import useItems from '@common/hooks/useItems';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';
import { CrudRow } from '@common/defs/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { CheckCircle, Cancel, AdminPanelSettings } from '@mui/icons-material';

interface Row extends CrudRow {
  email: string;
  createdAt: string;
  admin: boolean;
  accessLevel: string;
  department: string;
  status: string;
}

const SystemAdministratorsTable = () => {
  const { t, i18n } = useTranslation(['user']);
  const columns: GridColumns<Row> = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'email', headerName: t('user:list.email'), flex: 1 },
    {
      field: 'admin',
      headerName: 'Admin',
      width: 120,
      renderCell: (params) =>
        params.row.admin ? <CheckCircle color="success" /> : <Cancel color="error" />,
    },
    {
      field: 'accessLevel',
      headerName: t('user:list.access_level') || 'Access Level',
      width: 150,
      renderCell: (params) => {
        const level = params.row.accessLevel;
        return <span style={{ textTransform: 'capitalize' }}>{level}</span>;
      },
    },
    {
      field: 'department',
      headerName: t('user:list.department') || 'Department',
      width: 150,
      renderCell: (params) => {
        const dept = params.row.department;
        return <span>{dept}</span>;
      },
    },
    {
      field: 'status',
      headerName: t('user:list.status') || 'Status',
      width: 120,
      renderCell: (params) => {
        const status = params.row.status;
        return status === 'ACTIVE' ? <CheckCircle color="success" /> : <Cancel color="error" />;
      },
    },
    {
      field: 'createdAt',
      headerName: t('user:list.created_at') || "Date d'inscription",
      type: 'dateTime',
      flex: 1,
      renderCell: (params) => dayjs(params.row.createdAt).format('DD/MM/YYYY HH:mm'),
    },
  ];
  const [translatedColumns, setTranslatedColumns] = useState<GridColumns<Row>>(columns);
  useEffect(() => {
    setTranslatedColumns(columns);
  }, [t, i18n.language]);

  const itemToRow = (item: any): Row => {
    const user = item.user || {};
    return {
      id: item.id,
      email: user.email || '',
      createdAt: user.dateRegistered || item.createdAt || '',
      admin: Array.isArray(user.rolesNames) ? user.rolesNames.includes('SUPERADMIN') : false,
      accessLevel: item.accessLevel || item.access_level || '',
      department: Array.isArray(item.departments) ? item.departments.join(', ') : '',
      status: user.status || '',
    };
  };

  const useSystemAdministrators = (options?: any) =>
    useItems(SystemAdministratorsApiRoutes, options);

  return (
    <ItemsTable<any, any, any, Row>
      namespace={Namespaces.Users}
      routes={SystemAdministratorsRoutes}
      useItems={useSystemAdministrators}
      columns={translatedColumns}
      itemToRow={itemToRow}
      showEdit={() => true}
      showDelete={() => true}
      showLock
      exportable
    />
  );
};

export default SystemAdministratorsTable;
