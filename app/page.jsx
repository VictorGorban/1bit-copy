import React from "react";
import { redirect, permanentRedirect } from 'next/navigation'

export default function Index(params) {
  permanentRedirect('/users')
}




// redirect('/licenseKeys')