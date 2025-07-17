import React, { useEffect, useState } from 'react';
import useSettings, { Setting } from '../hooks/useSettings';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';

const SettingsForm = () => {
  const { fetchSettings, updateSetting } = useSettings();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchSettings();
      if (res.success && res.data) {
        setSettings(res.data);
        setValues(Object.fromEntries(res.data.map((s) => [s.key, s.value])));
      }
      setLoading(false);
    };
    load();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    setLoading(true);
    await updateSetting(key, values[key]);
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Platform Settings
      </Typography>
      <Grid container spacing={2}>
        {settings.map((setting) => (
          <Grid item xs={12} md={6} key={setting.key}>
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                label={setting.key}
                value={values[setting.key] || ''}
                onChange={(e) => handleChange(setting.key, e.target.value)}
                fullWidth
                disabled={loading}
              />
              <Button
                variant="contained"
                onClick={() => handleSave(setting.key)}
                disabled={loading}
              >
                Save
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SettingsForm;
