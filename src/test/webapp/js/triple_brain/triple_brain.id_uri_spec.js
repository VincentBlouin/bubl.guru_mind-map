/*
 * Copyright Vincent Blouin under the Mozilla Public License 1.1
 */

define([
    "triple_brain.id_uri",
    'test/webapp/js/mock'
], function (IdUri) {
    "use strict";
    describe("id_uri", function () {
        it("can tell if vertex uri is owned by current user", function () {
            expect(
                IdUri.isGraphElementUriOwnedByCurrentUser(
                    "\/service\/users\/not_foo\/graph\/vertex\/7c92d7a4-ad89-4225-bfbc-1a19063f1d74"
                )
            ).toBeFalsy();
            expect(
                IdUri.isGraphElementUriOwnedByCurrentUser(
                    "\/service\/users\/foo\/graph\/vertex\/7c92d7a4-ad89-4225-bfbc-1a19063f1d74"
                )
            ).toBeTruthy();
        });

        it("can tell if schema uri is owned by current user", function () {
            expect(
                IdUri.isGraphElementUriOwnedByCurrentUser(
                    "/service/users/not_foo/graph/schema/40e520f2-be43-4de8-8843-cf9c2e6dff92"
                )
            ).toBeFalsy();
            expect(
                IdUri.isGraphElementUriOwnedByCurrentUser(
                    "/service/users/foo/graph/schema/40e520f2-be43-4de8-8843-cf9c2e6dff92"
                )
            ).toBeTruthy();
        });
        it("can give schema short id from uri", function () {
            expect(
                IdUri.getSchemaShortId(
                    "/service/users/foo/graph/schema/40e520f2-be43-4de8-8843-cf9c2e6dff92"
                )
            ).toBe("40e520f2-be43-4de8-8843-cf9c2e6dff92");
        });
        it("can convert schema id to not owned schema uri", function () {
            expect(
                IdUri.convertSchemaUriToNonOwnedUri(
                    "/service/users/foo/graph/schema/40e520f2-be43-4de8-8843-cf9c2e6dff92"
                )
            ).toBe(
                "/service/users/foo/non_owned/schema/40e520f2-be43-4de8-8843-cf9c2e6dff92"
            );
        });
    });
});