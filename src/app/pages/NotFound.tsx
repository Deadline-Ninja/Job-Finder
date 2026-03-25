import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Home, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold tracking-tight text-[#2563EB] mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
            Page Not Found
          </h2>
          <p className="text-[#6B7280] text-lg max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="outline" className="border-[#E5E7EB] text-black hover:bg-gray-50">
              <Search className="w-4 h-4 mr-2" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
