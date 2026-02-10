"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

// defining the species without supabase, doing it manually
interface Species {
  scientific_name: string;
  common_name: string | null;
  total_population: number | null;
  kingdom: string;
  description: string | null;
}

/*
// similar to the AddSpeciesDialog using the open and close state
export function SpeciesDetailsDialog({ species }: {species: Species}) {
  // Control open/closed state of the dialog
  //const [open, setOpen] = useState<boolean>(false);

  return (

     // open={open} onOpenChange={setOpen}
    <Dialog>
      <DialogTrigger asChild>
     {// making the button component to be a simple text link and adjust margin and width also had to stop propogation //}
        <Button variant="link" className="w-full mt-3" onClick={(e) => { e.stopPropagation()}} >
        Learn More
      </Button>
    </DialogTrigger>

   // {// creating the "container" or box for the pop up on the page }
    //{// to display the information about the species taking into consideration mobile and desktop view with a scroll bar}
    <DialogContent className="max-w-[500px] sm:max-w-[600px] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{species.scientific_name}</DialogTitle>
        {// conditional statement that checks for common name and does nothing if no common name//}
        {species.common_name && <DialogDescription>{species.common_name}</DialogDescription>}
      </DialogHeader>

      <div className="space-y-2">
        <p>
          <strong>Kingdom:</strong> {species.kingdom}
        </p>

        <p>
          <strong>Total population:</strong>{" "}
          {species.total_population ?? "Unknown"}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {species.description ?? "No description available."}
        </p>
      </div>

      <DialogClose asChild>
        <Button variant="secondary" className="mt-4 w-full">
          Close
        </Button>
      </DialogClose>

    </DialogContent>
    </Dialog>

  );
}

*/

export function SpeciesDetailsDialog({ species }: { species: Species }) {
  const [open, setOpen] = useState(false);

  console.log("[SpeciesDetailsDialog] render", {
    species: species.scientific_name,
    open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button (manual control) */}
      <Button
        variant="link"
        className="mt-3 w-full"
        onClick={(e) => {
          e.stopPropagation();
          console.log("[Learn More Button] clicked → open = true");
          setOpen(true);
        }}
      >
        Learn More
      </Button>

      {/* Dialog content */}
      <DialogContent className="max-w-[500px] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
          {species.common_name && <DialogDescription>{species.common_name}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-2">
          <p>
            <strong>Kingdom:</strong> {species.kingdom}
          </p>
          <p>
            <strong>Total population:</strong> {species.total_population ?? "Unknown"}
          </p>
          <p>
            <strong>Description:</strong> {species.description ?? "No description available."}
          </p>
        </div>

        <DialogClose asChild>
          <Button
            variant="secondary"
            className="mt-4 w-full"
            onClick={() => {
              console.log("[Close Button] clicked → open = false");
              setOpen(false);
            }}
          >
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
