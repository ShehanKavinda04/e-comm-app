import { Button, Switch, Typography } from '@mui/material';

const SecuritySettings = ({
  settings,
  onToggle2FA,
  onToggleLoginNotifications,
  onChangeSecurityQuestion,
  onManageDevices,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-gray-700 font-medium">Two-Factor Authentication</Typography>
            <Typography variant="caption" className="text-gray-500">
              Add an extra layer of security to your account
            </Typography>
          </div>
          <Switch checked={settings.twoFactorAuth} onChange={onToggle2FA} color="primary" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-gray-700 font-medium">Login Notifications</Typography>
            <Typography variant="caption" className="text-gray-500">Get alerted on new logins</Typography>
          </div>
          <Switch checked={settings.loginNotifications} onChange={onToggleLoginNotifications} color="primary" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-gray-700 font-medium">Security Question</Typography>
            <Typography variant="caption" className="text-gray-500">
              {settings.hasSecurityQuestion ? 'Set' : 'Not set'}
            </Typography>
          </div>
          <Button size="small" variant="outlined" onClick={onChangeSecurityQuestion} sx={{ textTransform: 'none' }}>
            {settings.hasSecurityQuestion ? 'Change' : 'Set Up'}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-gray-700 font-medium">Connected Devices</Typography>
            <Typography variant="caption" className="text-gray-500">
              {settings.connectedDevices} active sessions
            </Typography>
          </div>
          <Button size="small" variant="outlined" onClick={onManageDevices} sx={{ textTransform: 'none' }}>
            Manage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;