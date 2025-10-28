import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { User, Thermometer, Gauge, RotateCw, RotateCcw, Bolt, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { api } from '../util/api';
import { ErrorPage } from './ErrorPage';
import LoadingPage from './LoadingPage';
import io from 'socket.io-client';

interface UserData {
  name: string;
  id: string;
  status: string;
}

interface HomePageProps {
  userData: UserData;
}

// let socket: any;
  // try {
  const socket = io.connect(import.meta.env.VITE_BACKEND_WEBSOCKET_URL);
  // } catch (e) {
  //   setError(`Can't connect through websocket!`);
  // }

export function HomePage() {
  const userData: UserData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState<{ value: number } | null>(null);
  const [rpm, setRpm] = useState<{ value: number } | null>(null);
  const [isClockwise, setIsClockwise] = useState(true);
  const [error, setError] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [isSecure, setIsSecure] = useState(false);
  const [kwh, setKwh] = useState("0");


  socket.on(`${localStorage.getItem('device_id')}/temperature`, (data: any) => {
    setMqttConnected(true);
    setIsCurrent(true);
    setTemperature(data.text);
  })
  socket.on(`${localStorage.getItem('device_id')}/rpm`, (data: any) => {
    setMqttConnected(true);
    setIsCurrent(true);
    setRpm(data.text);
  })
  socket.on(`${localStorage.getItem('device_id')}/motor_status`, (data: any) => {
    setMqttConnected(true);
    setIsCurrent(true);
    setIsEnabled(data.text == "0" ? false : true);
  })
  socket.on(`${localStorage.getItem('device_id')}/security_status`, (data: any) => {
    setMqttConnected(true);
    setIsCurrent(true);
    setIsSecure(data.text == "0" ? false : true);
  })
  socket.on(`${localStorage.getItem('device_id')}/kwh`, (data: any) => {
    setMqttConnected(true);
    setIsCurrent(true);
    setKwh(data.text);
  })
  

  const getTemperature = async () => {
    let curUser: any;
    try {
      setIsLoading(true);
      setError('');
       curUser = await api.get(`/temperatures/latest/${localStorage.getItem('device_id')}`, {headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }});
      setTemperature(curUser.data.data.temperature);
      setIsLoading(false);
    } catch (e: any) {
      if (!e.status){
        setError('There is error with the server');
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("device_id");
        localStorage.removeItem("user_data");
        window.location.reload();
        setError(e.response.data.message);
      }
      setIsLoading(false);
      return;
    }
  }

  const getRpm = async () => {
    let curUser: any;
    try {
      setIsLoading(true);
      setError('');
      curUser = await api.get(`/rpms/latest/${localStorage.getItem('device_id')}`, {headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }});
      setRpm(curUser.data.data.rpm);
      setIsClockwise(curUser.data.data.isClockwise == 1 ? true : false);
      setIsEnabled(curUser.data.data.isActive == 1 ? true : false);
      setIsLoading(false);
    } catch (e: any) {
      if (!e.status){
        setError('There is error with the server');
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("device_id");
        localStorage.removeItem("user_data");
        window.location.reload();
        setError(e.response.data.message);
      }
      setIsLoading(false);
      return;
    }
  }

  const updateRpmData = async ({
    rpmParam = 0,
    isClockwiseParam = false,
    isEnabledParam = false,
    dataChanged = 'rpm'
  }: { rpmParam?: number; isClockwiseParam?: boolean; isEnabledParam?: boolean, dataChanged: string }) => {
    try {
      setIsLoading(true);
      setError('');
      await api.post('/rpms', {
        user_id: userData.id,
        device_id: localStorage.getItem('device_id'),
        rpm: dataChanged == 'rpm' ? rpmParam : rpm,
        is_clockwise: dataChanged == 'is_clockwise' ? isClockwiseParam : isClockwise,
        is_active: dataChanged == 'is_active' ? isEnabledParam : isEnabled
      }, {headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }});
      setIsLoading(false);
    }
    catch (e: any) {
      if (!e.status){
        setError('There is error with the server');
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("device_id");
        localStorage.removeItem("user_data");
        window.location.reload();
        setError(e.response.data.message);
      }
      setIsLoading(false);
      return;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getTemperature();
      await getRpm();
    };
    fetchData();
  }, [retryCount]);
  
  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1); 
  };
  // // Mock data

  // const handleDirectionChange = (direction: 'clockwise' | 'counterclockwise') => {
  //   setIsClockwise(direction === 'clockwise');
  // };

  if(error != '') {
    return (
      <ErrorPage onRetry={handleRetry} errorType={'server'} errorMessage={error} />
    );
  }
  return (
    <div className="space-y-4">
      { isLoading && <LoadingPage/> }
      {/* User Info Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Terdaftar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Nama:</span>
            <span>{userData?.name}</span>
          </div>
          {/* <div className="flex justify-between items-center">
            <span className="text-muted-foreground">ID:</span>
            <span>{userData?.id}</span>
          </div> */}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Temperature & RPM Display */}
      <div className="grid grid-cols-2 gap-4">
        <Card style={{ display:'none' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl">{temperature}°C</div>
              <div className="text-sm text-muted-foreground">{isCurrent ? 'Current' : 'Last Active'}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              kWh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl">{kwh} kWh</div>
              <div className="text-sm text-muted-foreground">{isCurrent ? 'Current' : 'Last Active'}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              RPM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl">{rpm} RPM</div>
              <div className="text-sm text-muted-foreground">{isCurrent ? 'Current' : 'Last Active'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card style={{ display: 'none' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              kWh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl">{kwh?.value ? `${kwh.value}` : '0'} kWh</div>
              <div className="text-sm text-muted-foreground">{isCurrent ? 'Current' : 'Last Active'}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Status Sensor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled" className="flex items-center gap-2">
              {/* <Switch className="w-4 h-4" /> */}
              Is Enabled
            </Label>
            <Switch
              id="enabled"
              checked={isEnabled}
              onCheckedChange={ async () => { if (!mqttConnected){ return; }  await setIsEnabled(!isEnabled); updateRpmData({dataChanged: 'is_active', isEnabledParam: !isEnabled}) }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mqtt-status" className="flex items-center gap-2">
              {/* <Switch className="w-4 h-4" /> */}
              MQTT Status
            </Label>
            <Switch
              id="mqtt-status" disabled
              checked={mqttConnected}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="security-status" className="flex items-center gap-2">
              {/* <Switch className="w-4 h-4" /> */}
              Security Status
            </Label>
            <Switch
              id="security-status" disabled
              checked={isSecure}
            />
          </div>
        </CardContent>
      </Card>

      {/* Direction Control */}
      {/* <Card>
        <CardHeader className="pb-3">
          <CardTitle>Kontrol Arah Putaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="clockwise" className="flex items-center gap-2">
              <RotateCw className="w-4 h-4" />
              Clockwise
            </Label>
            <Switch
              id="clockwise"
              checked={isClockwise}
              onCheckedChange={ async () => { await setIsClockwise(true); updateRpmData({dataChanged: 'is_clockwise', isClockwiseParam: true})}}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="counterclockwise" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Counterclockwise
            </Label>
            <Switch
              id="counterclockwise"
              checked={!isClockwise}
              onCheckedChange={ async () => { await setIsClockwise(false); updateRpmData({dataChanged: 'is_clockwise', isClockwiseParam: false})}}
            />
          </div>
        </CardContent>
      </Card> */}

      {/* RPM Level Control */}
      {/* <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pengaturan RPM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rpm-low">Low</Label>
              <div className="text-sm text-muted-foreground">100 RPM</div>
            </div>
            <Switch
              id="rpm-low"
              checked={rpm === 100}
              onCheckedChange={async () => {await setRpm(100); updateRpmData({dataChanged: 'rpm', rpmParam: 100})}}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rpm-med">Medium</Label>
              <div className="text-sm text-muted-foreground">300 RPM</div>
            </div>
            <Switch
              id="rpm-med"
              checked={rpm === 300}
              onCheckedChange={async () => {await setRpm(300); updateRpmData({dataChanged: 'rpm', rpmParam: 300})}}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rpm-high">High</Label>
              <div className="text-sm text-muted-foreground">500 RPM</div>
            </div>
            <Switch
              id="rpm-high"
              checked={rpm === 500}
              onCheckedChange={async () => {await setRpm(500); updateRpmData({ dataChanged: 'rpm', rpmParam: 500 })}}
            />
          </div>
        </CardContent>
      </Card> */}

      {/* Current Settings Summary */}
      {/* <Card className="bg-accent/50">
        <CardHeader className="pb-3">
          <CardTitle>Pengaturan Saat Ini</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Arah:</span>
            <Badge variant={isClockwise ? 'default' : 'secondary'}>
              {isClockwise ? 'Clockwise' : 'Counterclockwise'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Level RPM:</span>
            <Badge variant="outline">
                {rpm === 100 ? 'LOW' : rpm === 300 ? 'MEDIUM' : 'HIGH'} ({rpm} RPM)
              </Badge>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}