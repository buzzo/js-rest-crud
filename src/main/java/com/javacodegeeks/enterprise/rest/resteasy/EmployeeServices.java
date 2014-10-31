package com.javacodegeeks.enterprise.rest.resteasy;

import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import com.google.gson.Gson;

@Path("/employer")
public class EmployeeServices {

	private static final List<Employee> database = new ArrayList<Employee>();
	private static int id = 1;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get(@QueryParam("count") final int count,
			@QueryParam("page") final int page, @Context final UriInfo context) {

		// TODO: lista de filtragens
		final Entry<String, List<String>> sort = retriveComplexParam(
				context.getQueryParameters(), PARAM.SORT);
		final Entry<String, List<String>> filter = retriveComplexParam(
				context.getQueryParameters(), PARAM.FILTER);

		System.out.println("-->" + sort + " " + count + " " + page + " "
				+ filter);

		return Response
				.status(Status.OK)
				.entity("{\"total\":" + database.size() + ",\"result\":"
						+ new Gson().toJson(database) + "}").build();
	}

	private static enum PARAM {
		SORT("sorting"), FILTER("filter");

		private String value;

		private PARAM(final String val) {
			value = val;
		}

	};

	private Entry<String, List<String>> retriveComplexParam(
			final MultivaluedMap<String, String> values, final PARAM param) {
		for (final Entry<String, List<String>> entry : values.entrySet()) {
			if (entry.getKey().startsWith(param.value)) {
				return entry;
			}
		}
		return null;
	}

	@DELETE
	@Consumes(MediaType.TEXT_PLAIN)
	public Response remove(final String empToRemove) {
		System.out.println("REMOVE: " + empToRemove);
		for (final Employee emp : database) {
			if (emp.getId() == Integer.parseInt(empToRemove)) {
				database.remove(emp);
				return Response.status(Status.OK).build();
			}
		}
		return Response.status(Status.NOT_FOUND).build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response post(Employee emp) {
		emp.setId(id++);
		System.out.println("ADD: " + emp.getId());
		database.add(emp);
		return Response.status(Status.OK).build();
	}

	public static class Result {
		private int total;
		private List<Employee> list;
	}

}
