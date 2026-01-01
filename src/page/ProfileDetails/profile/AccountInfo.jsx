const AccountInfo = ({ displayName, createdAt, membership }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-black mb-4">Account Info</h3>
      <div className="space-y-3 text-sm">
        <div className="flex gap-3">
          <span className="text-gray-600">Display Name:</span>
          <span className="text-black font-medium">{displayName}</span>
        </div>
        <div className="flex gap-3">
          <span className="text-gray-600">Account Created:</span>
          <span className="text-black font-medium">
            {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="flex gap-3">
          <span className="text-gray-600">Verification:</span>
          <span className="text-green-600 font-medium">Verified</span>
        </div>
        <div className="flex gap-3">
          <span className="text-gray-600">Membership:</span>
          <span className="text-orange-600 font-medium">{membership}</span>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;