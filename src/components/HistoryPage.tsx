import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, RotateCw, RotateCcw, Thermometer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { intervalToDuration, formatDuration } from 'date-fns';
import { api } from '../util/api';
import { id } from 'date-fns/locale';
import { ErrorPage } from './ErrorPage';

interface HistoryEntry {
  id: string;
  timestamp: string;
  date: string;
  direction: 'clockwise' | 'counterclockwise';
  rpmLevel: 'low' | 'med' | 'high';
  rpmValue: number;
  temperature: number;
  duration: string;
}

export function HistoryPage() {

  const [history, setHistory] = useState([]);
  const [curHistory, setCurHistory] = useState('device_status');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1); 
  };

  useEffect(() => {
    const fetchData = async () => {
      if (curHistory === 'device_status') {
        try {
          setIsLoading(true);
          setError('');
          const data = await api.get('/history/rpm/11aef772-ae2e-4a79-8303-e981ad8748d4', {headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }});
          setHistory(data.data.data.data);
          setIsLoading(false);
        } catch (e) {
          if (!e.status){
            setError('There is error with the server');
          } else {
            setError(e.response.data.message);
          }
          setIsLoading(false);
          return;
        }
      } else if (curHistory === 'temperature') {
        try {
          setIsLoading(true);
          setError('');
          const data = await api.get('/history/temperature/11aef772-ae2e-4a79-8303-e981ad8748d4', {headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }});
          setHistory(data.data.data.data);
          setIsLoading(false);
        } catch (e) {
          if (!e.status){
            setError('There is error with the server');
          } else {
            setError(e.response.data.message);
          }
          setIsLoading(false);
          return;
        }
      }
    }
    fetchData();
  }, [retryCount, curHistory]);

  if(error != '') {
    return (
      <ErrorPage onRetry={handleRetry} errorType={'server'} errorMessage={error} />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5" />
        <h2>Riwayat Operasi</h2>
      </div>
      <div className='grid grid-cols-2 gap-4 mb-2'>
        <div className={`flex items-center gap-2 border p-2 rounded-md justify-center ${curHistory === 'device_status' ? 'bg-accent' : ''}`} onClick={() => setCurHistory('device_status')}>
          <span>Device Status</span>
        </div>
        <div className={`flex items-center gap-2 border p-2 rounded-md justify-center ${curHistory === 'temperature' ? 'bg-accent' : ''}`} onClick={() => setCurHistory('temperature')}>
          <span>Temperature</span>
        </div>
      </div>

      {history.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Belum ada riwayat operasi
            </p>
          </CardContent>
        </Card>
      )}

      {curHistory === 'device_status' && history.map((entry, i) => (
        <Card key={entry.id} className="hover:bg-accent/30 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{new Date(entry?.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</CardTitle>
                <p className="text-sm text-muted-foreground">{new Date(entry?.createdAt).toLocaleTimeString('id-ID', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
              </div>
              <Badge variant="outline" className="text-xs">
               {/* {history[i + 1] 
                  ? formatDuration(
                      intervalToDuration({ 
                        start: new Date(history[i + 1]?.createdAt), 
                        end: new Date(entry?.createdAt) 
                      }), 
                      {
                        format: ['hours', 'minutes', 'seconds'],
                        locale: id // <-- Perbaikan di sini
                      }
                    ) 
                  : formatDuration(
                      intervalToDuration({ 
                        start: new Date(), 
                        end: new Date(entry?.createdAt) 
                      }), 
                      {
                        format: ['hours', 'minutes', 'seconds'],
                        locale: id // <-- Perbaikan di sini
                      }
                    )
                } */}
                {entry.isActive == 1 ? 'Enable' : 'Disable'}
              </Badge>
            </div>
          </CardHeader>
          {entry.isActive == 1 && <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                {entry.direction === 'clockwise' ? (
                  <RotateCw className="w-4 h-4" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {entry.isClockwise ? 'CW' : 'CCW'}
                </span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                <span className="text-sm">{entry.rpm} RPM</span>
              </div> */}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge 
                  variant={entry.rpm === 500 ? 'default' : entry.rpm === 300 ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {entry.rpm == 300 ? 'Medium' : entry.rpm == 500 ? 'High' : 'Low'}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Speed: {entry.rpm} RPM
              </div>
            </div>
          </CardContent>}
          
        </Card>
      ))}

      {curHistory === 'temperature' && history.map((entry, i) => (
        <Card key={entry.id} className="hover:bg-accent/30 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{new Date(entry?.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</CardTitle>
                <p className="text-sm text-muted-foreground">{new Date(entry?.createdAt).toLocaleTimeString('id-ID', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
              </div>
              <Badge variant="outline" className="text-xs">
               {/* {history[i + 1] 
                  ? formatDuration(
                      intervalToDuration({ 
                        start: new Date(history[i + 1]?.createdAt), 
                        end: new Date(entry?.createdAt) 
                      }), 
                      {
                        format: ['hours', 'minutes', 'seconds'],
                        locale: id // <-- Perbaikan di sini
                      }
                    ) 
                  : formatDuration(
                      intervalToDuration({ 
                        start: new Date(), 
                        end: new Date(entry?.createdAt) 
                      }), 
                      {
                        format: ['hours', 'minutes', 'seconds'],
                        locale: id // <-- Perbaikan di sini
                      }
                    )
                } */}
                <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                <span className="text-sm">{entry.temperature}°C</span>
              </div>
              </Badge>
            </div>
          </CardHeader>
        </Card>
      ))}


      
    </div>
  );
}