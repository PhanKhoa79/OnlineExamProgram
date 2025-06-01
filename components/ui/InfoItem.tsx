export function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium text-gray-600">{label}</span>
      <span>{value || 'Chưa cập nhật'}</span>
    </div>
  );
}
