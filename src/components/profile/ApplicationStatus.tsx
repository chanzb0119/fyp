// ApplicationStatus.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, CheckCircle, XCircle } from "lucide-react";

interface ApplicationStatusProps {
  status: string;
  createdAt: string;
  documentUrl?: string;
}

const ApplicationStatus = ({ status, createdAt, documentUrl }: ApplicationStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-500';
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className={`h-6 w-6 ${getStatusColor(status)}`} />;
      case 'approved':
        return <CheckCircle className={`h-6 w-6 ${getStatusColor(status)}`} />;
      case 'rejected':
        return <XCircle className={`h-6 w-6 ${getStatusColor(status)}`} />;
      default:
        return <Shield className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          Landlord Application Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              {getStatusIcon(status)}
              <div>
                <p className="font-semibold">Status</p>
                <p className={`${getStatusColor(status)}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Submitted on</p>
              <p className="font-medium">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {documentUrl && (
            <div>
              <p className="font-medium mb-2">Submitted Document</p>
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                View Document
              </a>
            </div>
          )}

          {status.toLowerCase() === 'pending' && (
            <div className="text-sm text-gray-500">
              We are currently reviewing your application. This process typically takes 2-3 business days.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatus;