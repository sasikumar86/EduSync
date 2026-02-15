import { useEffect, useState } from 'react';
import { Bus, MapPin } from 'lucide-react';
import api from '../../services/api';

export default function TransportPage() {
    const [vehicles, setVehicles] = useState([]);
    const [routes, setRoutes] = useState([]);
    useEffect(() => {
        api.get('/transport/vehicles').then((r) => setVehicles(r.data.data || []));
        api.get('/transport/routes').then((r) => setRoutes(r.data.data || []));
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-surface-900">Transport Management</h1><p className="text-surface-500 text-sm mt-1">Vehicles & routes</p></div>

            {/* Vehicles */}
            <div>
                <h2 className="font-semibold text-surface-800 mb-3">Vehicles ({vehicles.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicles.map((v) => (
                        <div key={v._id} className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border border-surface-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center"><Bus size={22} className="text-white" /></div>
                                <div><h3 className="font-semibold text-surface-900">{v.vehicleNumber}</h3><p className="text-xs text-surface-400 capitalize">{v.type}</p></div>
                            </div>
                            <div className="space-y-1 text-sm text-surface-500">
                                <p>Capacity: {v.capacity} seats</p>
                                <p>Driver: {v.driver?.name}</p>
                                <p>Phone: {v.driver?.phone}</p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-surface-100">
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${v.status === 'active' ? 'bg-accent-50 text-accent-700' : 'bg-surface-100 text-surface-600'}`}>{v.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Routes */}
            <div>
                <h2 className="font-semibold text-surface-800 mb-3">Routes ({routes.length})</h2>
                <div className="space-y-3">
                    {routes.map((r) => (
                        <div key={r._id} className="bg-white rounded-2xl p-5 shadow-card border border-surface-100">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3"><MapPin size={20} className="text-primary-500" /><h3 className="font-semibold text-surface-900">{r.name}</h3></div>
                                <span className="text-sm text-surface-500">Route #{r.routeNumber}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">{r.stops?.map((s, i) => (
                                <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-surface-50 rounded-lg text-xs text-surface-600"><span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>{s.name} ({s.time})</span>
                            ))}</div>
                            <div className="mt-3 flex gap-3 text-xs text-surface-400"><span>Distance: {r.distance} km</span><span>Duration: {r.estimatedTime} min</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
