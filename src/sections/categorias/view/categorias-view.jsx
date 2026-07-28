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

import { DashboardContent } from 'src/layouts/dashboard';
import { getCategorias, getCategoriasNivel1 } from 'src/actions/categorias';

import { penIcon, plusIcon } from 'src/components/icons';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CategoriasEditar2Dialog from 'src/sections/categorias/categorias-editar2-dialog';
import CategoriasEditar3Dialog from 'src/sections/categorias/categorias-editar3-dialog';
import CategoriasRegistrar2Dialog from 'src/sections/categorias/categorias-registrar2-dialog';
import CategoriasRegistrar3Dialog from 'src/sections/categorias/categorias-registrar3-dialog';

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
    setOpenEditar2Dialog,
    setOpenEditar3Dialog,
    setIdCategoriasNivel2,
    setIdCategoriasNivel3,
    setOpenRegistrar2Dialog,
    setOpenRegistrar3Dialog,
    setIdCategoriasNivel1Registrar,
    setIdCategoriasNivel2Registrar,
    ...other
  } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
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
              <>
                {item.nivel === 2 && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      setIdCategoriasNivel1Registrar(item.idCategoriasNivel1);
                      setOpenRegistrar2Dialog(true);
                    }}
                  >
                    {plusIcon}
                  </IconButton>
                )}

                {item.nivel === 3 && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      setIdCategoriasNivel2Registrar(item.idCategoriasNivel2);
                      setOpenRegistrar3Dialog(true);
                    }}
                  >
                    {plusIcon}
                  </IconButton>
                )}
              </>
            ) : (
              <>
                {item.nivel === 3 && item.total_productos !== undefined ? (
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

                {item.nivel === 2 && (
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => {
                      setOpenEditar2Dialog(true);
                      setIdCategoriasNivel2(item.idCategoriasNivel2);
                    }}
                    sx={{ p: 0, height: '15px' }}
                  >
                    {penIcon}
                  </IconButton>
                )}

                {item.nivel === 3 && (
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => {
                      setOpenEditar3Dialog(true);
                      setIdCategoriasNivel3(item.idCategoriasNivel3);
                    }}
                    sx={{ p: 0, height: '15px' }}
                  >
                    {penIcon}
                  </IconButton>
                )}
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
  const [categoriasNivel1, setCategoriasNivel1] = useState([]);
  const [openEditar2Dialog, setOpenEditar2Dialog] = useState(false);
  const [openEditar3Dialog, setOpenEditar3Dialog] = useState(false);
  const [openRegistrar2Dialog, setOpenRegistrar2Dialog] = useState(false);
  const [openRegistrar3Dialog, setOpenRegistrar3Dialog] = useState(false);
  const [idCategoriasNivel2, setIdCategoriasNivel2] = useState(null);
  const [idCategoriasNivel3, setIdCategoriasNivel3] = useState(null);
  const [idCategoriasNivel1Registrar, setIdCategoriasNivel1Registrar] = useState(null);
  const [idCategoriasNivel2Registrar, setIdCategoriasNivel2Registrar] = useState(null);

  const fetchCategorias = async () => {
    const res = await getCategorias('');
    console.log(res);
    setCategorias(res);
  };

  const fetchCategoriasNivel1 = async () => {
    const res = await getCategoriasNivel1();
    setCategoriasNivel1(res);
  };

  useEffect(() => {
    fetchCategorias();
    fetchCategoriasNivel1();
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Categorías"
        slotProps={{ heading: { color: `primary.main` } }}
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Categorías' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CategoriasEditar2Dialog
        open={openEditar2Dialog}
        setOpen={setOpenEditar2Dialog}
        id={idCategoriasNivel2}
        fetchCategorias={fetchCategorias}
      />

      <CategoriasEditar3Dialog
        open={openEditar3Dialog}
        setOpen={setOpenEditar3Dialog}
        id={idCategoriasNivel3}
        fetchCategorias={fetchCategorias}
      />

      <CategoriasRegistrar2Dialog
        open={openRegistrar2Dialog}
        setOpen={setOpenRegistrar2Dialog}
        idCategoriasNivel1={idCategoriasNivel1Registrar}
        fetchCategorias={fetchCategorias}
      />

      <CategoriasRegistrar3Dialog
        open={openRegistrar3Dialog}
        setOpen={setOpenRegistrar3Dialog}
        idCategoriasNivel2={idCategoriasNivel2Registrar}
        fetchCategorias={fetchCategorias}
      />

      <Card sx={{ p: 3 }}>
        <RichTreeView
          defaultExpandedItems={['3']}
          items={categorias}
          slots={{
            item: (props) => (
              <CustomTreeItem
                {...props}
                setOpenEditar2Dialog={setOpenEditar2Dialog}
                setOpenEditar3Dialog={setOpenEditar3Dialog}
                setIdCategoriasNivel2={setIdCategoriasNivel2}
                setIdCategoriasNivel3={setIdCategoriasNivel3}
                setOpenRegistrar2Dialog={setOpenRegistrar2Dialog}
                setOpenRegistrar3Dialog={setOpenRegistrar3Dialog}
                setIdCategoriasNivel1Registrar={setIdCategoriasNivel1Registrar}
                setIdCategoriasNivel2Registrar={setIdCategoriasNivel2Registrar}
              />
            ),
          }}
        />
      </Card>
    </DashboardContent>
  );
}
