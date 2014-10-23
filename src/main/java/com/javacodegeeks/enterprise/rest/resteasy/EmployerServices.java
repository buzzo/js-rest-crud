package com.javacodegeeks.enterprise.rest.resteasy;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/employer")
public class EmployerServices {

	private static final List<Employer> database = new ArrayList<Employer>();

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get(final String content) {
		System.out.println("----"+content);
		return Response.status(200).entity(database).build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response post(Employer emp) {
		System.out.println("ADD: " + emp.getCode());
		database.add(emp);
		return Response.status(200).build();
	}

}
