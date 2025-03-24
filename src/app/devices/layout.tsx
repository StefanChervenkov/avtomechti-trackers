import Navigation from '@/app/ui/navigation';


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navigation />
            {children}
        </div>
    );
}