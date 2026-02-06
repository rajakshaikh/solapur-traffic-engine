import { Link } from "react-router-dom";
import { Map, Shield, Users, ArrowRight } from "lucide-react";

const Index = () => {
  return (
   <div
  className="min-h-screen bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url('/bg-solapur-city.png')",
  }}
>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <Map className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold text-foreground">Solapur Gati</span>
                <span className="block text-xs text-muted-foreground">
                  Traffic & Parking Rule System
                </span>
              </div>
            </div>
            <Link
              to="/smc/login"
              className="text-sm font-medium text-primary hover:underline"
            >
              SMC Login →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Solapur Municipal Corporation
          </div>

          <h1 className="mx-auto mb-4 max-w-3xl text-4xl font-bold text-foreground md:text-5xl">
            Dynamic Traffic & Parking Rule System
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            A software-only traffic management system for Solapur city.
            No IoT hardware, no physical sensors—data-driven decisions enforced by humans.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/citizen"
              className="btn-gov-primary inline-flex items-center gap-2 px-6 py-3 text-base"
            >
              <Users className="h-5 w-5" />
              Citizen Portal
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/smc/login"
              className="btn-gov-secondary inline-flex items-center gap-2 px-6 py-3 text-base"
            >
              <Shield className="h-5 w-5" />
              SMC Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Two Interfaces */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-foreground">
            Two Separate Interfaces
          </h2>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* SMC Card */}
            <div className="gov-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">SMC Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Decision-Support & Planning
                  </p>
                </div>
              </div>

              <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
                <li>• Pattern-based traffic heatmap visualization</li>
                <li>• System-generated rule recommendations</li>
                <li>• Daily traffic & parking action lists</li>
                <li>• Parking impact zone identification</li>
                <li>• Photo verification system</li>
              </ul>

              <Link
                to="/smc/login"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Access Dashboard <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Citizen Card */}
            <div className="gov-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Citizen Portal</h3>
                  <p className="text-sm text-muted-foreground">Simple & Minimal</p>
                </div>
              </div>

              <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
                <li>• Bus schedule with peak-hour delay insights</li>
                <li>• One-tap traffic problem reporting</li>
                <li>• Photo upload for verification</li>
                <li>• No maps, no analytics visibility</li>
                <li>• Data contributors, not decision-makers</li>
              </ul>

              <Link
                to="/citizen"
                className="inline-flex items-center gap-1 text-sm font-medium text-success hover:underline"
              >
                Open Citizen Portal <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            System Philosophy
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p className="text-lg">
              “We don't just show traffic. We decide what rule should apply, where, and when.”
            </p>
            <p>Software decisions, enforced by humans.</p>
            <p className="font-medium text-foreground">
              No hardware. No sensors. No fantasy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Solapur Municipal Corporation — Traffic Department
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Solapur Gati: Dynamic Traffic & Parking Rule System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
