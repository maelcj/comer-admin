'use client';

import { useState, useEffect, forwardRef } from 'react';

import { Stack } from '@mui/system';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import {
  TreeItem2Root,
  TreeItem2Label,
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2GroupTransition,
} from '@mui/x-tree-view/TreeItem2';

import { paths } from 'src/routes/paths';

import { getCategorias } from 'src/actions/categorias';
import { DashboardContent } from 'src/layouts/dashboard';

import { penIcon, plusIcon } from 'src/components/icons';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CategoriasEditarDialog from '../categorias-editar-dialog';
import CategoriasRegistrarDialog from '../categorias-registrar-dialog';

// ----------------------------------------------------------------------

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

const CustomTreeItem = forwardRef((props, ref) => {
  const {
    id,
    itemId,
    label,
    disabled,
    children,
    setOpenEditarDialog,
    setCategoriaId,
    setOpenRegistrarDialog,
    setParentIdRegistrar,
    ...other
  } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps(other)}>
        <CustomTreeItemContent {...getContentProps()}>
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <Stack
            direction="row"
            onClick={(event) => {
              event.stopPropagation(); // Prevent expand/collapse
            }}
            sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
          >
            {item.label === 'agregar' ? (
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  setParentIdRegistrar(item.parentId);
                  setOpenRegistrarDialog(true);
                }}
              >
                {plusIcon}
              </IconButton>
            ) : (
              <>
                {item.total_productos !== undefined && item.total_productos > 0 ? (
                  <>
                    <Chip
                      label={item.total_productos}
                      size="small"
                      color="primary"
                      sx={{ height: '18px', fontSize: '0.7rem', mr: 0.5 }}
                    />
                    <TreeItem2Label {...getLabelProps()} />
                  </>
                ) : (
                  <TreeItem2Label {...getLabelProps()} />
                )}

                <IconButton
                  size="small"
                  color="warning"
                  onClick={() => {
                    setOpenEditarDialog(true);
                    setCategoriaId(item.categoryId);
                  }}
                  sx={{ p: 0, height: '15px' }}
                >
                  {penIcon}
                </IconButton>
              </>
            )}
          </Stack>
        </CustomTreeItemContent>
        {children && <TreeItem2GroupTransition {...getGroupTransitionProps()} />}
      </TreeItem2Root>
    </TreeItem2Provider>
  );
});

export function CategoriasView() {
  const [categorias, setCategorias] = useState([]);

  const [openEditarDialog, setOpenEditarDialog] = useState(false);
  const [openRegistrarDialog, setOpenRegistrarDialog] = useState(false);

  const [categoriaId, setCategoriaId] = useState(null);
  const [parentIdRegistrar, setParentIdRegistrar] = useState(null);

  const fetchCategorias = async () => {
    const res = await getCategorias('');
    setCategorias(res);
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Categorías"
        slotProps={{ heading: { color: `primary.main` } }}
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Categorías' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CategoriasEditarDialog
        open={openEditarDialog}
        setOpen={setOpenEditarDialog}
        id={categoriaId}
        fetchCategorias={fetchCategorias}
      />

      <CategoriasRegistrarDialog
        open={openRegistrarDialog}
        setOpen={setOpenRegistrarDialog}
        parentId={parentIdRegistrar}
        fetchCategorias={fetchCategorias}
      />

      <Card sx={{ p: 3 }}>
        <RichTreeView
          defaultExpandedItems={['add-root']}
          items={categorias}
          slots={{
            item: (props) => (
              <CustomTreeItem
                {...props}
                setOpenEditarDialog={setOpenEditarDialog}
                setCategoriaId={setCategoriaId}
                setOpenRegistrarDialog={setOpenRegistrarDialog}
                setParentIdRegistrar={setParentIdRegistrar}
              />
            ),
          }}
        />
      </Card>
    </DashboardContent>
  );
}
