import React, { useEffect, useState, useRef } from 'react';
import { Tree } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { getAllPermissions } from '@/features/role/services/roleServices';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

const buildPermissionTree = (permissions: string[]): TreeNode[] => {
  const tree: Record<string, TreeNode> = {};

  permissions.forEach((permission) => {
    const [resource, action] = permission.split(':');
    if (!tree[resource]) {
      tree[resource] = {
        key: resource,
        label: resource,
        children: [],
      };
    }
    tree[resource].children!.push({
      key: permission,
      label: action,
    });
  });

  return Object.values(tree);
};

type PermissionTreeViewProps = {
  onChangeSelectedKeys?: (permissions: string[]) => void;
  defaultSelectedKeys?: string[];
};

export default function PermissionTreeView({ onChangeSelectedKeys, defaultSelectedKeys = [] }: PermissionTreeViewProps) {
  const [selectedKeys, setSelectedKeys] = useState<Record<string, any>>({});
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const allKeys: string[] = [];

  const checkboxRef = useRef<HTMLInputElement>(null);

  // Lấy toàn bộ key để so sánh
  const collectAllKeys = (nodes: TreeNode[]) => {
    const result: string[] = [];
    const traverse = (nodeList: TreeNode[]) => {
      for (const node of nodeList) {
        result.push(node.key);
        if (node.children) {
          traverse(node.children);
        }
      }
    };
    traverse(nodes);
    return result;
  };

  // Cập nhật selectedKeys khi nhận defaultSelectedKeys
  useEffect(() => {
    if (defaultSelectedKeys.length && nodes.length) {
      const selected: Record<string, any> = {};

      // Đánh dấu quyền con
      defaultSelectedKeys.forEach((key) => {
        selected[key] = { checked: true };
      });

      // Hàm đệ quy set trạng thái cha
      const updateParentCheckStatus = (nodes: TreeNode[]) => {
        for (const node of nodes) {
          if (node.children && node.children.length > 0) {
            const childKeys = node.children.map((child) => child.key);
            const allChecked = childKeys.every((key) => selected[key]?.checked);
            const someChecked = childKeys.some((key) => selected[key]?.checked);

            if (allChecked) {
              selected[node.key] = { checked: true };
            } else if (someChecked) {
              selected[node.key] = { partialChecked: true };
            }

            // Đệ quy xuống con
            updateParentCheckStatus(node.children);
          }
        }
      };

      updateParentCheckStatus(nodes);

      setSelectedKeys(selected);

      if (onChangeSelectedKeys) {
        onChangeSelectedKeys(defaultSelectedKeys);
      }
    }
  }, [defaultSelectedKeys, nodes]);
  
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await getAllPermissions();
        const treeNodes = buildPermissionTree(data);
        setNodes(treeNodes);
      } catch (error) {
        console.error('Failed to load permissions:', error);
      }
    };
    fetchPermissions();
  }, []);

  // Update indeterminate state
  useEffect(() => {
    if (!checkboxRef.current) return;

    const allKeysFlat = collectAllKeys(nodes);
    const selectedCount = allKeysFlat.filter((key) => selectedKeys[key])?.length;

    if (selectedCount === 0) {
      checkboxRef.current.indeterminate = false;
      checkboxRef.current.checked = false;
    } else if (selectedCount === allKeysFlat.length) {
      checkboxRef.current.indeterminate = false;
      checkboxRef.current.checked = true;
    } else {
      checkboxRef.current.indeterminate = true;
      checkboxRef.current.checked = false;
    }
  }, [selectedKeys, nodes]);

  const handleAllToggle = () => {
    const allKeysFlat = collectAllKeys(nodes);

    const allSelected = allKeysFlat.every((key) => selectedKeys[key]);
    if (allSelected) {
      setSelectedKeys({});
      if (onChangeSelectedKeys) {
        onChangeSelectedKeys([]); 
      }
    } else {
      const all: Record<string, any> = {};
      allKeysFlat.forEach((key) => {
        all[key] = { checked: true };
      });
      setSelectedKeys(all);

      if (onChangeSelectedKeys) {
        const selectedPermissions = allKeysFlat.filter((key) => key.includes(':'));
        onChangeSelectedKeys(selectedPermissions);
      }
    }
  };

  const onSelectionChange = (e: any) => {
    setSelectedKeys(e.value);

    if (onChangeSelectedKeys) {
        const selectedPermissions = Object.entries(e.value)
        .filter(([key, val]) => key.includes(':') && val.checked)
        .map(([key]) => key);

        onChangeSelectedKeys(selectedPermissions);
    }
  };

  return (
    <div className="flex flex-col gap-1 max-w-3xl bg-white rounded-lg shadow-md">
      {/* Checkbox ALL với trạng thái indeterminate */}
      <div>
        <label className="flex items-center gap-2">
          <input
            ref={checkboxRef}
            type="checkbox"
            onChange={handleAllToggle}
            className="w-4 h-4 cursor-pointer"
          />
          <span className="font-xs font-gray-700">Chọn tất cả quyền</span>
        </label>
      </div>

      {/* Cây Tree */}
      <Tree
        value={nodes}
        selectionMode="checkbox"
        selectionKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        className="w-full"
        nodeTemplate={(node) => {
          const isParent = node.children && node.children.length > 0;
          return (
            <span
              className={`
                ${isParent ? 'font-semibold text-gray-900 pl-2' : 'font-normal text-gray-700 pl-6'}
                hover:bg-sky-100 rounded cursor-pointer
              `}
            >
              {node.label}
            </span>
          );
        }}
      />
    </div>
  );
}
