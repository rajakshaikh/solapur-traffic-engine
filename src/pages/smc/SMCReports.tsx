 import { useState } from "react";
 import { 
   FileText, 
   Search,
   ParkingCircle,
   ShoppingCart,
   AlertTriangle,
   TrafficCone,
   Clock,
   CheckCircle2,
   Loader2,
   AlertCircle,
   Image
 } from "lucide-react";
 import { citizenReports, reportStatusLabels, type CitizenReport, type ReportStatus } from "@/data/mockData";
 import { cn } from "@/lib/utils";
 import { Input } from "@/components/ui/input";
 import { Badge } from "@/components/ui/badge";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import { useToast } from "@/hooks/use-toast";
 
 const issueTypeIcons = {
   parking: ParkingCircle,
   hawker: ShoppingCart,
   blocked: AlertTriangle,
   signal: TrafficCone,
 };
 
 const issueTypeLabels = {
   parking: 'Illegal Parking',
   hawker: 'Hawker Blocking',
   blocked: 'Road Blocked',
   signal: 'Broken Signal',
 };
 
 const statusConfig: Record<ReportStatus, { icon: typeof CheckCircle2; color: string; bgColor: string }> = {
   received: { icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-muted' },
   under_review: { icon: Loader2, color: 'text-warning', bgColor: 'bg-warning/10' },
   action_planned: { icon: AlertCircle, color: 'text-primary', bgColor: 'bg-primary/10' },
   closed: { icon: CheckCircle2, color: 'text-success', bgColor: 'bg-success/10' },
 };
 
 export default function SMCReports() {
   const [reports, setReports] = useState<CitizenReport[]>(citizenReports);
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState<string>("all");
   const { toast } = useToast();
 
   const filteredReports = reports.filter((report) => {
     const matchesSearch = 
       report.reportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
       report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
       report.phoneNumber.includes(searchQuery);
     
     const matchesStatus = statusFilter === "all" || report.status === statusFilter;
     
     return matchesSearch && matchesStatus;
   });
 
   const handleStatusChange = (reportId: string, newStatus: ReportStatus) => {
     setReports((prev) =>
       prev.map((report) =>
         report.id === reportId
           ? { 
               ...report, 
               status: newStatus, 
               statusUpdatedAt: new Date().toLocaleString('en-IN', {
                 year: 'numeric',
                 month: '2-digit',
                 day: '2-digit',
                 hour: '2-digit',
                 minute: '2-digit',
                 hour12: true
               })
             }
           : report
       )
     );
     
     toast({
       title: "Status Updated",
       description: `Report status changed to "${reportStatusLabels[newStatus]}"`,
     });
   };
 
   const statusCounts = {
     received: reports.filter(r => r.status === 'received').length,
     under_review: reports.filter(r => r.status === 'under_review').length,
     action_planned: reports.filter(r => r.status === 'action_planned').length,
     closed: reports.filter(r => r.status === 'closed').length,
   };
 
   return (
     <div className="space-y-6">
       {/* Header */}
       <div>
         <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
           <FileText className="h-7 w-7 text-primary" />
           Citizen Reports
         </h1>
         <p className="text-muted-foreground mt-1">
           Manage and update status of citizen-reported issues
         </p>
       </div>
 
       {/* Stats Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {Object.entries(statusCounts).map(([status, count]) => {
           const config = statusConfig[status as ReportStatus];
           const Icon = config.icon;
           return (
             <div key={status} className="gov-card p-4">
               <div className="flex items-center gap-3">
                 <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bgColor)}>
                   <Icon className={cn("h-5 w-5", config.color)} />
                 </div>
                 <div>
                   <p className="text-2xl font-bold text-foreground">{count}</p>
                   <p className="text-xs text-muted-foreground">{reportStatusLabels[status as ReportStatus]}</p>
                 </div>
               </div>
             </div>
           );
         })}
       </div>
 
       {/* Filters */}
       <div className="gov-card p-4">
         <div className="flex flex-col sm:flex-row gap-4">
           <div className="flex-1">
             <Input
               type="text"
               placeholder="Search by Report ID, location, or phone..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full"
             />
           </div>
           <Select value={statusFilter} onValueChange={setStatusFilter}>
             <SelectTrigger className="w-full sm:w-48">
               <SelectValue placeholder="Filter by status" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Statuses</SelectItem>
               <SelectItem value="received">Received</SelectItem>
               <SelectItem value="under_review">Under Review</SelectItem>
               <SelectItem value="action_planned">Action Planned</SelectItem>
               <SelectItem value="closed">Closed</SelectItem>
             </SelectContent>
           </Select>
         </div>
       </div>
 
       {/* Reports Table */}
       <div className="gov-card overflow-hidden">
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>Report ID</TableHead>
               <TableHead>Type</TableHead>
               <TableHead>Location</TableHead>
               <TableHead>Date/Time</TableHead>
               <TableHead>Photo</TableHead>
               <TableHead>Status</TableHead>
               <TableHead>Update Status</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {filteredReports.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                   No reports found matching your criteria
                 </TableCell>
               </TableRow>
             ) : (
               filteredReports.map((report) => {
                 const IssueIcon = issueTypeIcons[report.issueType];
                 const statusInfo = statusConfig[report.status];
                 const StatusIcon = statusInfo.icon;
 
                 return (
                   <TableRow key={report.id}>
                     <TableCell className="font-medium">{report.reportId}</TableCell>
                     <TableCell>
                       <div className="flex items-center gap-2">
                         <IssueIcon className="h-4 w-4 text-muted-foreground" />
                         <span className="text-sm">{issueTypeLabels[report.issueType]}</span>
                       </div>
                     </TableCell>
                     <TableCell className="max-w-[200px] truncate" title={report.location}>
                       {report.location}
                     </TableCell>
                     <TableCell className="text-sm">{report.dateTime}</TableCell>
                     <TableCell>
                       {report.hasPhoto ? (
                         <Image className="h-4 w-4 text-success" />
                       ) : (
                         <span className="text-xs text-muted-foreground">No</span>
                       )}
                     </TableCell>
                     <TableCell>
                       <Badge className={cn(statusInfo.bgColor, statusInfo.color, "border-0")}>
                         <StatusIcon className="h-3 w-3 mr-1" />
                         {reportStatusLabels[report.status]}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       <Select
                         value={report.status}
                         onValueChange={(value) => handleStatusChange(report.id, value as ReportStatus)}
                       >
                         <SelectTrigger className="w-36 h-8 text-xs">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="received">Received</SelectItem>
                           <SelectItem value="under_review">Under Review</SelectItem>
                           <SelectItem value="action_planned">Action Planned</SelectItem>
                           <SelectItem value="closed">Closed</SelectItem>
                         </SelectContent>
                       </Select>
                     </TableCell>
                   </TableRow>
                 );
               })
             )}
           </TableBody>
         </Table>
       </div>
     </div>
   );
 }