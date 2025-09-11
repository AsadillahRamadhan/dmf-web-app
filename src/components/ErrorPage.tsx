import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { WifiOff, RefreshCw, AlertTriangle, Settings } from 'lucide-react';

interface ErrorPageProps {
  onRetry: () => void;
  errorType?: 'connection' | 'server' | 'timeout';
  errorMessage?: string;
}

export function ErrorPage({ onRetry, errorType = 'connection', errorMessage }: ErrorPageProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    // Simulate retry delay
    setTimeout(() => {
      setIsRetrying(false);
      onRetry();
    }, 2000);
  };

//   const getErrorInfo = () => {
//     switch (errorType) {
//       case 'connection':
//         return {
//           icon: WifiOff,
//           title: 'Tidak Dapat Terhubung',
//           description: 'Tidak dapat menjangkau server. Periksa koneksi internet Anda.',
//           color: 'text-destructive'
//         };
//       case 'server':
//         return {
//           icon: AlertTriangle,
//           title: 'Server Bermasalah',
//           description: 'Server sedang mengalami gangguan. Silakan coba lagi nanti.',
//           color: 'text-orange-500'
//         };
//       case 'timeout':
//         return {
//           icon: RefreshCw,
//           title: 'Koneksi Timeout',
//           description: 'Permintaan memakan waktu terlalu lama. Periksa koneksi Anda.',
//           color: 'text-yellow-500'
//         };
//       default:
//         return {
//           icon: WifiOff,
//           title: 'Terjadi Kesalahan',
//           description: 'Terjadi kesalahan tidak terduga.',
//           color: 'text-destructive'
//         };
//     }
//   };

//   const errorInfo = getErrorInfo();
  const ErrorIcon = AlertTriangle;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-full bg-accent flex items-center justify-center text-destructive`}>
              <ErrorIcon className="w-10 h-10" />
            </div>
          </div>
          <h1 className="mb-2">There is error</h1>
          <p className="text-muted-foreground text-center">
            {errorMessage}
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Detail Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="destructive">
                Tidak Terhubung
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Waktu:</span>
              <span>{new Date().toLocaleTimeString('id-ID')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleRetry}
            className="w-full"
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Mencoba Ulang...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Muat Ulang Halaman
          </Button>
        </div>

        {/* Troubleshooting Tips */}
        <Card className="mt-6 bg-accent/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Tips Penyelesaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                Periksa koneksi internet Anda
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                Pastikan server dapat dijangkau
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                Coba beberapa saat lagi
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                Hubungi administrator jika masalah berlanjut
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Status Indicator */}
        <div className="flex items-center justify-center mt-6 gap-2">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">
            Sedang memantau koneksi...
          </span>
        </div>
      </div>
    </div>
  );
}