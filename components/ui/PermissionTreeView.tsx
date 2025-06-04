import React, { useEffect, useState, useRef } from 'react';
import { Tree } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { getAllPermissions } from '@/features/role/services/roleServices';
import { 
  Security, 
  Person, 
  Quiz,
  Help,
  Subject,
  Schedule,
  Class,
  AccountCircle,
  Visibility,
  Add,
  Edit,
  Delete
} from '@mui/icons-material';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

// Icon mapping for different resources
const getResourceIcon = (resource: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'role': <Security className="w-4 h-4 text-blue-600" />,
    'student': <Person className="w-4 h-4 text-green-600" />,
    'exam': <Quiz className="w-4 h-4 text-purple-600" />,
    'question': <Help className="w-4 h-4 text-orange-600" />,
    'subject': <Subject className="w-4 h-4 text-red-600" />,
    'schedule': <Schedule className="w-4 h-4 text-indigo-600" />,
    'class': <Class className="w-4 h-4 text-teal-600" />,
    'account': <AccountCircle className="w-4 h-4 text-pink-600" />,
  };
  return iconMap[resource] || <Security className="w-4 h-4 text-gray-600" />;
};

// Icon mapping for different actions
const getActionIcon = (action: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'view': <Visibility className="w-3 h-3 text-blue-500" />,
    'create': <Add className="w-3 h-3 text-green-500" />,
    'update': <Edit className="w-3 h-3 text-yellow-500" />,
    'delete': <Delete className="w-3 h-3 text-red-500" />,
  };
  return iconMap[action] || <Security className="w-3 h-3 text-gray-500" />;
};

// Vietnamese labels for resources
const getResourceLabel = (resource: string) => {
  const labelMap: Record<string, string> = {
    'role': 'Phân quyền',
    'student': 'Sinh viên', 
    'exam': 'Bài thi',
    'question': 'Câu hỏi',
    'subject': 'Môn học',
    'schedule': 'Lịch thi',
    'class': 'Lớp học',
    'account': 'Tài khoản',
  };
  return labelMap[resource] || resource;
};

// Vietnamese labels for actions
const getActionLabel = (action: string) => {
  const labelMap: Record<string, string> = {
    'view': 'Xem',
    'create': 'Tạo',
    'update': 'Sửa', 
    'delete': 'Xóa',
  };
  return labelMap[action] || action;
};

const buildPermissionTree = (permissions: string[]): TreeNode[] => {
  const tree: Record<string, TreeNode> = {};

  permissions.forEach((permission) => {
    const [resource, action] = permission.split(':');
    if (!tree[resource]) {
      tree[resource] = {
        key: resource,
        label: getResourceLabel(resource),
        children: [],
      };
    }
    tree[resource].children!.push({
      key: permission,
      label: getActionLabel(action),
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
        .filter(([key, val]) => key.includes(':') && (val as any)?.checked)
        .map(([key]) => key);

        onChangeSelectedKeys(selectedPermissions);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      {/* Select All Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            ref={checkboxRef}
            type="checkbox"
            onChange={handleAllToggle}
            className="w-4 h-4 text-blue-600 cursor-pointer rounded"
          />
          <span className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-blue-600 transition-colors">
            Chọn tất cả quyền
          </span>
        </label>
      </div>

      {/* Permission Tree */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Tree
          value={nodes}
          selectionMode="checkbox"
          selectionKeys={selectedKeys}
          onSelectionChange={onSelectionChange}
          className="w-full permission-tree"
          nodeTemplate={(node) => {
            const isParent = node.children && node.children.length > 0;
            const [resource, action] = (node.key as string).split(':');
            
            if (isParent) {
              // Parent node (Resource)
              return (
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg group">
                  {getResourceIcon(resource)}
                  <span className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 transition-colors">
                    {getResourceLabel(resource)}
                  </span>
                  <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                    {node.children?.length || 0} quyền
                  </span>
                </div>
              );
            } else {
              // Child node (Action)
              return (
                <div className="flex items-center gap-3 p-2 ml-6 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-lg group">
                  {getActionIcon(action)}
                  <span className="font-medium text-gray-700 dark:text-gray-300 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {getActionLabel(action)}
                  </span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {node.key}
                  </span>
                </div>
              );
            }
          }}
        />
      </div>

      {/* Permission Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Đã chọn: {Object.keys(selectedKeys).filter(key => key.includes(':') && selectedKeys[key]?.checked).length} quyền
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            Tổng: {collectAllKeys(nodes).filter(key => key.includes(':')).length} quyền
          </span>
        </div>
      </div>
    </div>
  );
}
